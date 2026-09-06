# Ramat Hashofet MBTiles Builder

ממיר קובץ KMZ (Google Earth) לקובץ MBTiles עם תמונות לוויין מגוגל - לשימוש ב-DJI Pilot 2.

## מה זה עושה

1. פותח את קובץ ה-KMZ ומחלץ את ה-KML (פוליגונים, נקודות, קווים)
2. מוריד אריחי תמונות לוויין מ-Google Maps
3. מצייר את הפוליגונים עם הצבעים המקוריים מה-KML
4. מוסיף תוויות טקסט בעברית (שמות מקומות) בכל רמות הזום
5. מספרי בתים מופיעים רק בזום 17-18
6. מגביל אריחים לאזור ה-"Main Area" בלבד

## דרישות

```bash
pip install Pillow requests
```

Python 3 עם sqlite3 (מגיע מובנה).

## שימוש

```bash
cd Map/
python3 ramat_hashofet_mbtiles.py
```

ייקח את `Ramat Hashofet.kmz` ויצור `ramat_hashofet.mbtiles`.

### הגדרות בראש הסקריפט

```python
KMZ_FILE = "Ramat Hashofet.kmz"
OUTPUT_FILE = "ramat_hashofet.mbtiles"
MIN_ZOOM = 13                # מקסימום zoom-out ב-DJI Pilot 2
MAX_ZOOM = 18                # פירוט גבוה
NUMERIC_LABEL_MIN_ZOOM = 17  # מספרי בתים מזום 17 ומעלה
```

## העלאה ל-DJI Pilot 2

1. העתק את קובץ ה-`.mbtiles` לכרטיס SD
2. הכנס את הכרטיס לשלט של הרחפן
3. ב-DJI Pilot 2: הגדרות מפה > ייבוא מפה אופליין > בחר את הקובץ

## מידע טכני

- **מקור תמונות לוויין**: Google Maps Satellite
- **פורמט אריחים**: PNG, 256x256 פיקסלים
- **מערכת קואורדינטות**: TMS (Y-flipped) - תקן MBTiles
- **פונט**: Arial Unicode (תמיכה בעברית)
- **גודל קובץ אופייני**: ~140MB לזום 13-18
