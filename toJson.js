const fs = require('fs');
const path = require('path');

const REGEX_SECTIONS = /^\#{3}.*\n\n- Waktu.*\n- Pukul.*\n- Pemateri.*\n- Slide.*\n- Video.*\n.*\n.*/gm;
const REGEX_DATE = /^- Waktu.*/gm;
const REGEX_TIME = /^- Pukul.*/gm;
const REGEX_SPEAKER = /^- Pemateri.*/gm;
const REGEX_SLIDE = /^- Slide.*/gm;
const REGEX_VIDEO = /^- Video.*/gm;
const REGEX_TITLE = /^\#{3}.*/gm;
const REGEX_REGISTRASI = /^- Registrasi.*/gm;

const getCoverUrl = (idx) => `https://github.com/phpid-jakarta/phpid-online-learning-2020/raw/master/cover/${idx}.jpg`;
const getContent = (ctx, regex, titleString) => {
  const res = ctx.match(regex);

  console.log('👀  ', res, ctx);

  if (res && res.length > 0) {
    return res[0].replace(`${titleString}`, '').trim()
  }

  return '';
}

const main = async () => {
	try {
		const readmeContent = await fs.readFileSync(path.resolve(`./README.md`), { encoding: 'utf-8' });
		const matchContent = readmeContent.match(REGEX_SECTIONS);
		const allData = []

		matchContent.forEach((ctx, idx) => {
			if (!ctx.startsWith('### Template')) {
                                const sessionIndex = (matchContent.length - idx);
				const videosRaw = getContent(ctx, REGEX_VIDEO, '- Video:');
				const videos = videosRaw.split(',').map(i => i.replace('- ', '').trim());
                                const date = getContent(ctx, REGEX_DATE, '- Waktu:');
                                const time = getContent(ctx, REGEX_TIME, '- Pukul:');
                                const speaker = getContent(ctx, REGEX_SPEAKER, '- Pemateri:');
                                const slide = getContent(ctx, REGEX_SLIDE, '- Slide:');
                                const topic = getContent(ctx, REGEX_TITLE, '### ');
                                const register = getContent(ctx, REGEX_REGISTRASI, '- Registrasi:');

                                const data = {
					"date": date,
					"time": time,
					"speaker": speaker,
					"slide": slide,
					"topic": topic,
					"videos": videos,

                                        // field URL is deprecated, use registrasi field
                                        "url": register,
                                        "registrasi": register,

                                        "cover": getCoverUrl(sessionIndex),
				};

				allData.push(data);
                                console.log('👉 Get data: ', JSON.stringify(data));

			}
		});

		fs.writeFile(path.resolve('./data.json'), JSON.stringify({
                        message: 'field URL is deprecated, use registrasi',
                        credits: 'PHPID Community',
			data: allData,
		}), function (err) {
			if (err) {
				return console.log('❌ Error write file data.json', err);
			}
			console.log('✅ Success write file data.json');
		});

	} catch (error) {
		console.error('❌ Error read file README.md', error);
	}
};

main();
