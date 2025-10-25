
import type { Request, Response } from 'express';
import { Country } from '../models/country.js';
import { fetchCountries, fetchExchangeRates } from '../utils/api.js';
import { generateSummaryImage } from '../utils/image.js';
import { Op } from 'sequelize';
import type { OrderItem } from 'sequelize';
import * as  fs from 'fs'



const sortOptions: Record<string, OrderItem[]> = {
  gdp_desc: [['estimated_gdp', 'DESC']],
  gdp_asc: [['estimated_gdp', 'ASC']],
  name_asc: [['name', 'ASC']],
  name_desc: [['name', 'DESC']],
};

export const refreshCountries = async (req: Request, res: Response) => {
  try {
    const [countryRes, exchangeRes] = await Promise.all([
      fetchCountries(),
      fetchExchangeRates()
    ]);

    

    const exchangeRates = exchangeRes.data.rates;
    const now = new Date();

    
    for (const data of countryRes.data) {

      
      const currency = data.currencies?.[0]?.code || null;
      const rate = currency ? exchangeRates[currency] : null;
      const multiplier = Math.floor(Math.random() * 1001) + 1000;

      const errors: Record<string, string> = {};
      if (data.name === undefined || data.name === null) errors.name = 'is required';
      if (data.population === undefined || data.population === null) errors.population = 'is required';
      // if (!currency) errors.currency_code = 'is required';

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors
        });
      }


      const estimated_gdp = rate
        ? (data.population * multiplier) / rate
        : currency === null
        ? 0
        : null;

      await Country.upsert({
        name: data.name,
        capital: data.capital,
        region: data.region,
        population: data.population,
        currency_code: currency,
        exchange_rate: rate,
        estimated_gdp,
        flag_url: data.flag,
        last_refreshed_at: now
      });
    }

    await generateSummaryImage();
    res.status(200).json({ message: 'Countries refreshed' });
  } catch (err) {
    console.error(err);
    res.status(503).json({
      error: 'External data source unavailable',
      details: 'Could not fetch data from one or more APIs'
    });
  }
};

export const getCountries = async (req: Request, res: Response) => {
  const { region, currency, sort } = req.query;

  const where: any = {};
  if (region) where.region = region;
  if (currency) where.currency_code = currency;

  const order: OrderItem[] = sortOptions[sort as string] || [];

  try {
    const countries = await Country.findAll({
      where,
      order,
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });

    res.json(countries);

  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const getCountryByName = async (req: Request, res: Response) => {
  const country = await Country.findOne({
    where: { name: { [Op.like]: req.params.name } },
    attributes: { exclude: ['createdAt', 'updatedAt'] }
  });

  if (!country) {
    return res.status(404).json({ error: 'Country not found' });
  }

  res.json(country);
};

export const deleteCountry = async (req: Request, res: Response) => {
  const result = await Country.destroy({
    where: { name: { [Op.like]: req.params.name } }
  });

  if (result === 0) {
    return res.status(404).json({ error: 'Country not found' });
  }

  res.json({ message: 'Country deleted' });
};

export const getStatus = async (req: Request, res: Response) => {
  const total = await Country.count();
  const latest = await Country.findOne({ order: [['last_refreshed_at', 'DESC']] });

  res.json({
    total_countries: total,
    last_refreshed_at: latest?.toJSON().last_refreshed_at
  });
};

export const getSummaryImage = async (req: Request, res: Response) => {
  const imagePath = 'cache/summary.png';
  if (!fs.existsSync(imagePath)) {
    return res.status(404).json({ error: 'Summary image not found' });
  }

  res.sendFile(imagePath, { root: '.' });
};
