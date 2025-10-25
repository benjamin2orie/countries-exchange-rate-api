
import {Router} from 'express';
import {
  refreshCountries,
  getCountries,
  getCountryByName,
  deleteCountry,
  getStatus,
  getSummaryImage
} from '../controllers/conutryControler.js'

const router = Router();

router.post('/countries/refresh', refreshCountries);
router.get('/countries', getCountries);
router.get('/status', getStatus);
router.get('/countries/image', getSummaryImage);
router.get('/countries/:name', getCountryByName);
router.delete('/countries/:name', deleteCountry);


export default router;
