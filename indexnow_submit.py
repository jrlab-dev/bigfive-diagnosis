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
# IndexNow API（IndexNow共通エンドポイント。Bingもここを受信する）
ENDPOINT = "https://api.indexnow.org/indexnow"
# 1リクエストあたりの最大URL数（IndexNow仕様: 10,000）
BATCH = 10000


def load_key():
    with open(KEY_FILE, encoding="utf-8") as f:
        return f.read().strip()


def urls_from_sitemap():
    with open(SITEMAP, encoding="utf-8") as f:
        xml = f.read()
    return re.findall(r"<loc>(.*?)</loc>", xml)


def submit(url_list, key):
    key_location = "https://{host}/{key}.txt".format(host=HOST, key=key)
    body = {
        "host": HOST,
        "key": key,
        "keyLocation": key_location,
        "urlList": url_list,
    }
    data = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(
        ENDPOINT,
        data=data,
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return resp.status, resp.read().decode("utf-8", errors="ignore")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", errors="ignore")


def main():
    key = load_key()
    if not key:
        print("[ERROR] _INDEXNOW_KEY.txt が空です。", file=sys.stderr)
        sys.exit(1)

    if len(sys.argv) > 1:
        # 引数で指定されたパスを絶対URL化
        base = "https://" + HOST + "/"
        urls = [a if a.startswith("http") else base + a.lstrip("/") for a in sys.argv[1:]]
    else:
        urls = urls_from_sitemap()

    urls = [u.strip() for u in urls if u.strip()]
    print("送信対象: {n} 件".format(n=len(urls)))
    print("ホスト  : {h}".format(h=HOST))
    print("キー確認: https://{host}/{k}.txt".format(host=HOST, k=key))
    print("-" * 50)

    total_ok = 0
    for i in range(0, len(urls), BATCH):
        chunk = urls[i:i + BATCH]
        status, body = submit(chunk, key)
        # 200=受理 / 202=後で処理 / 422=キー検証失敗 等
        ok = status in (200, 202)
        if ok:
            total_ok += len(chunk)
        print("  [{i}-{j}] HTTP {st} {msg}".format(
            i=i + 1, j=min(i + BATCH, len(urls)),
            st=status, msg="OK" if ok else "(要確認) " + body[:120]))
    print("-" * 50)
    print("完了: {ok}/{n} 件を送信".format(ok=total_ok, n=len(urls)))


if __name__ == "__main__":
    main()
