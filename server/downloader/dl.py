#-*-encoding:utf-8-*-
import youtube_dl
import os


# 接下来为设置参数:
download_url = "https://www.youtube.com/watch?v=nXIRTLPcn34"
# YouTube视频的播放列表或者网址url
playlist_start = 1
playlist_end = 0
output_dir = "./"


def downnnn():
    Youtube_options = {
        'format': 'best', 'restrictfilenames': False}
    if output_dir:
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
            os.chdir(output_dir)
        else:
            os.chdir(output_dir)
    if playlist_start:
        Youtube_options['playliststart'] = playlist_start
    if playlist_end and (playlist_end >= playlist_start):
        Youtube_options['playlistend'] = playlist_end
    with youtube_dl.YoutubeDL(Youtube_options) as ydl:
        ydl.download([download_url])

downnnn()
