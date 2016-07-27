#-*-encoding:utf-8-*-
import youtube_dl
import os
import json


def main():
    Youtube_options = {'format': 'best', 'restrictfilenames': False}
    with open(r'urls.json', 'r') as f:
        urls = json.loads(f.read())["urls"]

    with youtube_dl.YoutubeDL(Youtube_options) as ydl:
        ydl.download(urls)

main()
