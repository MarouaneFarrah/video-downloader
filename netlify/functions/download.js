const ytdlp = require('yt-dlp-exec');

exports.handler = async (event, context) => {
    // جلب الرابط ونوع التحميل من الـ Query Parameters
    const videoUrl = event.queryStringParameters ? event.queryStringParameters.url : null;
    const downloadType = event.queryStringParameters ? event.queryStringParameters.type : 'video';

    if (!videoUrl) {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ success: false, message: 'الرابط مطلوب' }),
        };
    }

    try {
        // إعدادات yt-dlp حسب نوع الطلب (فيديو أو صوت)
        const options = downloadType === 'audio' 
            ? { format: 'bestaudio/best', dumpSingleJson: true }
            : { format: 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best', dumpSingleJson: true };

        const output = await ytdlp(videoUrl, options);

        // إرجاع النتيجة الناجحة بصيغة JSON
        return {
            statusCode: 200,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' // السماح بالاتصال
            },
            body: JSON.stringify({
                success: true,
                title: output.title,
                downloadUrl: output.url
            }),
        };

    } catch (error) {
        console.error('Error fetching video:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                success: false, 
                message: 'تعذر معالجة الفيديو، يرجى التأكد من أن الرابط عام وصحيح.' 
            }),
        };
    }
};