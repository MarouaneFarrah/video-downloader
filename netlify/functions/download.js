const ytdlp = require('yt-dlp-exec');

exports.handler = async (event, context) => {
    const videoUrl = event.queryStringParameters ? event.queryStringParameters.url : null;
    const downloadType = event.queryStringParameters ? event.queryStringParameters.type : 'video';

    if (!videoUrl) {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ success: false, message: 'الرابط مطلوب' }),
        };
    }

    try {
        // إعدادات تتجنب أخطاء الشهادات وتضمن جلب الروابط المباشرة
        const options = downloadType === 'audio' 
            ? { format: 'bestaudio/best', dumpSingleJson: true, noCheckCertificates: true, geoBypass: true }
            : { format: 'best/bestvideo+bestaudio/best', dumpSingleJson: true, noCheckCertificates: true, geoBypass: true };

        const output = await ytdlp(videoUrl, options);

        return {
            statusCode: 200,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: true,
                title: output.title || 'فيديو محمل',
                downloadUrl: output.url || (output.requested_downloads && output.requested_downloads[0].url)
            }),
        };

    } catch (error) {
        console.error('Download Error Details:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ 
                success: false, 
                message: 'تعذر معالجة الرابط. تأكد أن المنشور عام وليس خاصاً.' 
            }),
        };
    }
};
