import pickle
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from flask import Flask, render_template, request, jsonify

CLIENT_ID = "70a9fb89662f4dac8d07321b259eaad7"
CLIENT_SECRET = "4d6710460d764fbbb8d8753dc094d131"

client_credentials_manager = SpotifyClientCredentials(
    client_id=CLIENT_ID, client_secret=CLIENT_SECRET
)
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)
music = pickle.load(open("df.pkl", "rb"))
similarity = pickle.load(open("similarity.pkl", "rb"))

app = Flask(__name__)


def get_album_details(song_name, artist_name):
    search_query = f"track:{song_name} artist:{artist_name}"
    results = sp.search(q=search_query, type="track")

    details = {
        "cover_url": "https://i.postimg.cc/0QNxYz4V/social.png",
        "album_url": None,
    }

    try:
        tracks = results.get("tracks", {}).get("items", [])
        # print("Tracks:", tracks)

        if not tracks:
            print("No tracks found.")
            return details

        track = tracks[0]

        # Print the entire 'track' object
        # print("Track Object:", track)

        album = track.get("album")

        if not album:
            return details

        external_urls = album.get("external_urls")
        spotify_album_external_url = (
            external_urls.get("spotify") if external_urls else None
        )
        details["album_url"] = spotify_album_external_url

        images = album.get("images")

        if images:
            details["cover_url"] = images[0]["url"]

    except (KeyError, IndexError) as e:
        print(f"Error accessing Spotify API response: {e}")

    # If any of the checks fail, return a default image URL
    return details


def recommend(song):
    # TODO: Use a dictionary
    # {name: , poster:}
    selected_song = music[music["song"] == song]

    if selected_song.empty:
        print(f"Song '{song}' not found in the dataset.")
        return []

    index = selected_song.index[0]
    distances = sorted(
        list(enumerate(similarity[index])), reverse=True, key=lambda x: x[1]
    )
    recommended_music = []

    for i in distances[1:6]:
        # fetch the music poster
        if 0 <= i[0] < len(music):
            artist = music.iloc[i[0]].artist
            # print(artist)
            # print(music.iloc[i[0]].song)
            album_details = get_album_details(music.iloc[i[0]].song, artist)
            music_name = music.iloc[i[0]].song
            recommended_music.append({"name": music_name, **album_details})

    return recommended_music


@app.get("/")
def home():
    return render_template("index.html")


@app.get("/recommendations")
def recommendations():
    query = request.args.get("query", "")
    albums = recommend(query)
    return jsonify(albums)

@app.get("/hints")
def hints():
    return jsonify(list(music["song"].values))


if __name__ == "__main__":
    app.run(port=5000)
