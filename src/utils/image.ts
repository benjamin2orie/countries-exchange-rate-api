


import sharp from 'sharp';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { Country } from '../models/country.js';
import { Op } from 'sequelize';
import { Model} from 'sequelize'


interface CountryAttributes {
  name: string;
  estimated_gdp: number;
  // add other fields as needed
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const generateSummaryImage = async () => {
  const topCountries = await Country.findAll({
    order: [['estimated_gdp', 'DESC']],
    limit: 5,
  }) as Model<CountryAttributes>[];

  const total = await Country.count();
  const timestamp = new Date().toISOString();

  const summaryLines = [
    `Total Countries: ${total}`,
    'Top 5 by GDP:',
    ...topCountries.map(c => {
      const country = c.toJSON() as { name: string; estimated_gdp: number };
      return `${country.name}: $${country.estimated_gdp.toFixed(2)}`;
    }),
    `Last Refreshed: ${timestamp}`
  ];

  const svgText = `
    <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
      <style>
        text { font-family: Arial, sans-serif; font-size: 20px; fill: #000; }
      </style>
      ${summaryLines.map((line, i) => `<text x="20" y="${40 + i * 40}">${line}</text>`).join('')}
    </svg>
  `;

  const cacheDir = path.join(__dirname, '../../cache');
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  const outputPath = path.join(cacheDir, 'summary.png');

  await sharp(Buffer.from(svgText))
    .png()
    .toFile(outputPath);
};



// export const generateSummaryImage = async () => {
//   const topCountries = await Country.findAll({
//     order: [['estimated_gdp', 'DESC']],
//     limit: 5,
//   }) as Model<CountryAttributes>[]

//   const total = await Country.count();
//   const timestamp = new Date().toISOString();

// //   const summary = `
// //     Total Countries: ${total}
// //     Top 5 by GDP:
// //     ${topCountries.map(c => `${c.name}: ${c.estimated_gdp?.toFixed(2)}`).join('\n')}
// //     Last Refresh: ${timestamp}
// //     `;
//     const summary = `
//     Total Countries: ${total}
//     Top 5 by GDP:
//     ${topCountries.map(c => {
//     const country = c.toJSON() as { name: string; estimated_gdp: number };
//     return `${country.name}: $${country.estimated_gdp.toFixed(2)}`;
//     }).join("\n")}

//     Last Refreshed: ${timestamp}
//     `;

//     const cacheDir = path.join(__dirname, '../../cache');
//     if (!fs.existsSync(cacheDir)) {
//     fs.mkdirSync(cacheDir, { recursive: true });
//     }

//   const outputPath = path.join(__dirname, '../../cache/summary.png');
//   fs.writeFileSync(outputPath, summary); // simplified for text-based image

// //   await sharp({
// //     create: {
// //       width: 600,
// //       height: 300,
// //       channels: 4,
// //       background: '#ffffff'
// //     }
// //   })
// //     .png()
// //     .composite([{ input: Buffer.from(summary), top: 20, left: 20 }])
// //     .toFile(outputPath);


//     await sharp({
//     create: {
//         width: 600,
//         height: 300,
//         channels: 4,
//         background: '#ffffff'
//     }
//     })
//     .png()
//     .toFile(outputPath);
// };
