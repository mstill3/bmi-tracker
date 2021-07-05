let dark = false;
let smooth = true;
let filled = false;

const labels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
];

let weightOverTime = [205, 205, 205];

const BMI_THRESHOLDS = [
  {
    to: 18.5,
    classification: 'Underweight',
    backgroundColor: '#DC143C',
    borderColor: '#DC143C',
  },
  {
    from: 18.5, 
    to: 24.99,
    classification: 'Normal Weight',
    backgroundColor: '#32CD32',
    borderColor: '#32CD32',
  },
  {
    from: 25, 
    to: 29.99,
    classification: 'Overweight',
    backgroundColor: '#FF8C00',
    borderColor: '#FF8C00',
  },
  {
    from: 30, 
    to: 34.99,
    classification: 'Obesity (Class 1)',
    backgroundColor: '#DC143C',
    borderColor: '#DC143C',
  },
  {
    from: 35, 
    to: 39.99,
    classification: 'Obesity (Class 2)',
    backgroundColor: '#B22222',
    borderColor: '#B22222',
  },
  {
    from: 40, 
    to: 70,
    classification: 'Morbid Obesity',
    backgroundColor: '#8B0000',
    borderColor: '#8B0000',
  }
];

const toKilograms = (weightLb) => weightLb * 0.453592;

const toPounds = (weightKg) => weightKg / 0.453592;

const toMeters = (heightFt, heightIn) => (heightFt * 0.3048) + (heightIn * 0.0254);

const calculateBMI = (weightKg, heightMt) => weightKg / Math.pow(heightMt, 2);

const calculateWeightKg = (bmi, heightMt) => bmi * Math.pow(heightMt, 2);


// DATA
let data = {
  labels: labels,
  datasets: [{
    label: 'My Weight',
    backgroundColor: '#d4d4d4',
    borderColor: '#d4d4d4',
    data: weightOverTime,
  }]
};

// CONFIG
const config = {
  type: 'line',
  data,
  options: {
    elements: {
      line: {
        tension: 0.4
      }
    }
  }
};

// ACTIONS
$('#darkButton').click(() => {
  dark = !dark;
  if(dark) {
    $('#body').css('background-color', 'black');
  } else {
    $('#body').css('background-color', 'white');
 
  }
});

$('#curveButton').click(() => {
  smooth = !smooth;
  myChart.options.elements.line.tension = smooth ? 0.4 : 0;
  myChart.update();
});

$('#fillButton').click(() => {
  filled = !filled;
  if (filled) {
    myChart.data.datasets.forEach(dataset => {
      dataset.fill = 'start';
    });
  } else {
    myChart.data.datasets.forEach(dataset => {
      dataset.fill = false;
    });
  }
  myChart.update();
});

$('#bmiButton').click(() => {
  const weightLb = $('#weightTextbox').val();
  const heightFt = $('#heightFtTextbox').val();
  const heightIn = $('#heightInTextbox').val();

  const weightKg = toKilograms(weightLb);
  const heightMt = toMeters(heightFt, heightIn);

  const bmi = calculateBMI(weightKg, heightMt);
  $('#bmiTextfield').text('BMI:' +  bmi);

  const myBmiThresholds = BMI_THRESHOLDS.map((bmiThreshold) => ({
    ...bmiThreshold,
    score: toPounds(calculateWeightKg(bmiThreshold.to, heightMt))
  }));

  // console.log(JSON.stringify(myBmiThresholds));
  myBmiThresholds.forEach(thresh => {
    const arr = Array(weightOverTime.length);
    arr.fill(thresh.score);
    data.datasets.push({
      label: thresh.classification,
      backgroundColor: thresh.backgroundColor,
      // borderColor: thresh.borderColor,
      data: arr,
      fill: 'start',
    });
  });
  myChart.update();
});



// CHART
var myChart = new Chart(
  document.getElementById('myChart'),
  config
);