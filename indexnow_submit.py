#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
IndexNow 送信スクリプト（Bing / IndexNow 対応）
==================================================
新規記事の追加や既存ページの更新を、Bingへ「即時」通知します。
GitHub Pages にデプロイ後、本スクリプトを実行するとインデックスが早まります。

使い方:
  python indexnow_submit.py                # sitemap.xml 内の全URLを送信
  python indexnow_submit.py blog/xxx.html  # 特定パスのみ送信（複数可）
  python indexnow_submit.py --post         # POSTバッチ送信（※Bingは403になる場合あり）

送信方式の注意:
  既定は GET方式（URLごとに1リクエスト）。Bingではこの方式が HTTP 202 で確実受理される。
  POSTバッチ（--post）はBing側がBWT認証を要求し UserForbiddedToAccessSite(403) になるため、
  Bing向けにはGET方式を推奨。

前提:
  - ルートに {KEY}.txt（中身=KEY）がデプロイ済みであること
  - Python標準ライブラリのみ使用（追加インストール不要）
"""
import sys
import os
import json
import urllib.request
import urllib.error
import re

HERE = os.path.dirname(os.path.abspath(__file__))
KEY_FILE = os.path.join(HERE, "_INDEXNOW_KEY.txt")
SITEMAP = os.path.join(HERE, "sitemap.xml")

# デプロイ先ホスト（CNAME・sitemap.xml に合わせる）
HOST = "bigfive.jr-genius.jp"
# IndexNow API
ENDPOINT_GET = "https://api.indexnow.org/indexnow"   # GET（単URL）既定
ENDPOINT_POST = "https://api.indexnow.org/indexnow"  # POST（バッチ）


def load_key():
    with open(KEY_FILE, encoding="utf-8") as f:
        return f.read().strip()


def urls_from_sitemap():
    with open(SITEMAP, encoding="utf-8") as f:
        xml = f.read()
    return re.findall(r"<loc>(.*?)</loc>", xml)


def submit_get(url, key):
    """GET方式（単URL）。Bingで確実受理される。"""
    full = "{e}?url={u}&key={k}".format(e=ENDPOINT_GET, u=url, k=key)
    req = urllib.request.Request(full, method="GET")
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            return resp.status
    except urllib.error.HTTPError as e:
        return e.code
    except Exception:
        return 0


def submit_post(url_list, key):
    """POST方式（バッチ）。BingではBWT認証がないと403になる場合あり。"""
    key_location = "https://{host}/{key}.txt".format(host=HOST, key=key)
    body = {"host": HOST, "key": key, "keyLocation": key_location, "urlList": url_list}
    data = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(
        ENDPOINT_POST, data=data,
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return resp.status, resp.read().decode("utf-8", errors="ignore")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", errors="ignore")


def main():
    use_post = "--post" in sys.argv
    args = [a for a in sys.argv[1:] if a != "--post"]

    key = load_key()
    if not key:
        print("[ERROR] _INDEXNOW_KEY.txt が空です。", file=sys.stderr)
        sys.exit(1)

    if args:
        base = "https://" + HOST + "/"
        urls = [a if a.startswith("http") else base + a.lstrip("/") for a in args]
    else:
        urls = urls_from_sitemap()

    urls = [u.strip() for u in urls if u.strip()]
    print("送信対象: {n} 件".format(n=len(urls)))
    print("ホスト  : {h}".format(h=HOST))
    print("方式    : {m}".format(m="POSTバッチ" if use_post else "GET（URLごと）"))
    print("キー確認: https://{host}/{k}.txt".format(host=HOST, k=key))
    print("-" * 50)

    if use_post:
        status, body = submit_post(urls, key)
        ok = status in (200, 202)
        print("  HTTP {st} {msg}".format(st=status, msg="OK" if ok else "(要確認) " + body[:120]))
        print("-" * 50)
        print("完了: {ok}/{n}".format(ok=(len(urls) if ok else 0), n=len(urls)))
        return

    # GET方式: URLごとに送信
    ok = 0
    fail = 0
    for i, u in enumerate(urls, 1):
        st = submit_get(u, key)
        if st in (200, 202):
            ok += 1
        else:
            fail += 1
            print("  [FAIL {st}] {u}".format(st=st, u=u))
        if i % 50 == 0:
            print("  ... {i}/{n} 処理中（受理 {ok}）".format(i=i, n=len(urls), ok=ok))
    print("-" * 50)
    print("完了: 受理 {ok} / 失敗 {fail} / 計 {n}".format(ok=ok, fail=fail, n=len(urls)))


if __name__ == "__main__":
    main()
