const express = require('express');
const cors = require('cors');
const ytdlp = require('yt-dlp-exec');

const app = express();
app.use(cors()); // السماح لصفحة HTML بالاتصال بالباك إند

app.get('/download', async (req, res) => {
    const videoUrl = req.query.url;
    const downloadType = req.query.type; // 'video' أو 'audio'

    if (!videoUrl) {
        return res.status(400).json({ success: false, message: 'الرابط مطلوب' });
    }

    try {
        // استخراج رابط التحميل المباشر باستخدام yt-dlp
        const options = downloadType === 'audio' 
            ? { format: 'bestaudio/best', dumpSingleJson: true }
            : { format: 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best', dumpSingleJson: true };

        const output = await ytdlp(videoUrl, options);

        // إرجاع الرابط المباشر للواجهة الأمامية
        return res.json({
            success: true,
            title: output.title,
            downloadUrl: output.url
        });
    } catch (error) {
        console.error('Error fetching video:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'تعذر معالجة الفيديو، يرجى التأكد من أن الرابط عام وصحيح.' 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});