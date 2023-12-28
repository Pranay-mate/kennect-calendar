const express = require('express');
const moment = require('moment');

const PORT = 3000;
const app = express();
app.use(express.static('./'));
app.use(express.urlencoded({ extended: true }));

app.get('/calculateDate', (req, res) => {
  try {
    let { method, fromDate, value, daysOrWeeks } = req.query;

    if (!(method && fromDate && value)) {
        return res.status(400).send('Missing required parameters');
    }

    const fromDateMoment = moment(fromDate, 'DD-MMM-YYYY');

    let finalValue;
    if (method === 'add') {
      finalValue = value;
    } else if (method === 'subtract') {
      finalValue = -value;
    } else {
      return res.status(400).send('Invalid method');
    }

    daysOrWeeks = daysOrWeeks == 'weeks' ? 'weeks':'days';
    fromDateMoment.add(finalValue, daysOrWeeks);

    let result = fromDateMoment.format('DD-MMM-YYYY');

    if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json({ result });
    } else {
        return res.send(`Result: ${result}`);
    }
  } catch (error) {
    res.status(400).send('Invalid date format or other error');
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
