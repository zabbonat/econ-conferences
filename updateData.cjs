const fs = require('fs');

const data = JSON.parse(fs.readFileSync('src/data/conferences.json', 'utf8'));

const newConfsRaw = [
  {id:'18',name:'AEDE Conference',year:'2022',location:'Porto, Portugal',type:'Invited keynote speaker',coordinates:[41.1579,-8.6291]},
  {id:'19',name:'ISSI Conference',year:'2021',location:'Online',type:'Invited plenary speaker',coordinates:[0,0]},
  {id:'20',name:'Advanced Methods in Departmental Evaluation',year:'2021',location:'Online',type:'Invited speaker',coordinates:[0,0]},
  {id:'21',name:'Models in quantitative science and technology studies',year:'2021',location:'Online',type:'Invited speaker',coordinates:[0,0]},
  {id:'22',name:'CDKD2021',year:'2021',location:'Online',type:'Invited speaker',coordinates:[0,0]},
  {id:'23',name:'LTC2021 E-Science and Digital Libraries',year:'2021',location:'Online',type:'Keynote speaker',coordinates:[0,0]},
  {id:'24',name:'Workshop ShareScience',year:'2019',location:'Rome, Italy',type:'Invited speaker',coordinates:[41.9028,12.4964]},
  {id:'25',name:'Fields of Research classification workshop',year:'2019',location:'Berlin, Germany',type:'Invited speaker',coordinates:[52.52,13.405]},
  {id:'26',name:'NAPW',year:'2018',location:'Miami, FL, USA',type:'Invited plenary speaker',coordinates:[25.7617,-80.1918]},
  {id:'27',name:'OECD workshop on Semantic Analysis for Innovation Policy',year:'2018',location:'Paris, France',type:'Invited speaker',coordinates:[48.8566,2.3522]},
  {id:'28',name:'CMStatistics 2017',year:'2017',location:'London, UK',type:'Invited presentation',coordinates:[51.5074,-0.1278]},
  {id:'29',name:'European Commission training workshop',year:'2017',location:'Brussels, Belgium',type:'Invited speaker',coordinates:[50.8503,4.3517]},
  {id:'30',name:'EPFL Web of Science data workshop',year:'2017',location:'Lausanne, Switzerland',type:'Invited speaker',coordinates:[46.5197,6.6323]},
  {id:'31',name:'EC-OECD workshop on Semantic Technologies',year:'2017',location:'Brussels, Belgium',type:'Invited speaker',coordinates:[50.8503,4.3517]},
  {id:'32',name:'CMStatistics 2016',year:'2016',location:'Seville, Spain',type:'Invited presentation',coordinates:[37.3891,-5.9845]},
  {id:'33',name:'Data-driven Discovery conference',year:'2016',location:'Beijing, China',type:'Invited speaker',coordinates:[39.9042,116.4074]},
  {id:'34',name:'CMStatistics 2015',year:'2015',location:'London, UK',type:'Invited presentation',coordinates:[51.5074,-0.1278]},
  {id:'35',name:'Leuven LEER Workshop',year:'2015',location:'Leuven, Belgium',type:'Keynote speaker',coordinates:[50.8798,4.7005]},
  {id:'36',name:'Workshop on Knowledge, Diversity and Performance',year:'2014',location:'Rome, Italy',type:'Invited speaker',coordinates:[41.9028,12.4964]},
  {id:'37',name:'First EBRP Workshop',year:'2013',location:'Amsterdam, Netherlands',type:'Invited speaker',coordinates:[52.3676,4.9041]},
  {id:'38',name:'Workshop ASE Nonparametric Frontier Analysis',year:'2013',location:'Bucharest, Romania',type:'Keynote speaker',coordinates:[44.4268,26.1025]},
  {id:'39',name:'ERA Conference',year:'2012',location:'Nicosia, Cyprus',type:'Invited speaker',coordinates:[35.1856,33.3823]},
  {id:'40',name:'JRC workshop Indicators for the Innovation Union',year:'2012',location:'Ispra, Italy',type:'Invited expert',coordinates:[45.8155,8.6083]},
  {id:'41',name:'X Convegno nazionale INBB',year:'2012',location:'Rome, Italy',type:'Invited speaker',coordinates:[41.9028,12.4964]},
  {id:'42',name:'X Workshop SIEPI',year:'2012',location:'Perugia, Italy',type:'Keynote speaker',coordinates:[43.1107,12.3908]},
  {id:'43',name:'Convegno La ricerca universitaria e la sua valutazione',year:'2011',location:'Milan, Italy',type:'Invited speaker',coordinates:[45.4642,9.19]},
  {id:'44',name:'ESOF2010 workshop',year:'2010',location:'Turin, Italy',type:'Invited speaker',coordinates:[45.0703,7.6869]},
  {id:'45',name:'Workshop in honor of Léopold Simar',year:'2009',location:'Louvain-la-Neuve, Belgium',type:'Invited speaker',coordinates:[50.6681,4.6118]},
  {id:'46',name:'Convegno ANPRI',year:'2008',location:'Rome, Italy',type:'Invited speaker',coordinates:[41.9028,12.4964]},
  {id:'47',name:'INGENIO workshop',year:'2008',location:'Valencia, Spain',type:'Invited speaker',coordinates:[39.4699,-0.3763]},
  {id:'48',name:'XXI Congress of the Italian Society of Microsurgery',year:'2005',location:'Turin, Italy',type:'Chair of symposium',coordinates:[45.0703,7.6869]},
  {id:'49',name:'Forum 2004 of the European Neurosciences Societies',year:'2004',location:'Lisbon, Portugal',type:'Organizing committee',coordinates:[38.7223,-9.1393]},
  {id:'50',name:'International Symposium on Peripheral Nerve Regeneration',year:'2010',location:'Turin, Italy',type:'Organizing committee',coordinates:[45.0703,7.6869]},
  {id:'51',name:'International Symposium on Peripheral Nerve Regeneration',year:'2014',location:'Turin, Italy',type:'Organizing committee',coordinates:[45.0703,7.6869]},
  {id:'52',name:'International Symposium on Peripheral Nerve Regeneration',year:'2015',location:'Hannover, Germany',type:'Organizing committee',coordinates:[52.3759,9.732]},
  {id:'53',name:'International Symposium on Peripheral Nerve Regeneration',year:'2017',location:'Barcelona, Spain',type:'Organizing committee',coordinates:[41.3851,2.1734]},
  {id:'54',name:'International Conference in Cultural Economics',year:'2010',location:'Copenhagen, Denmark',type:'Conference presentation',coordinates:[55.6761,12.5683]},
  {id:'55',name:'DIME Conference Organizing for Networked Innovation',year:'2010',location:'Stresa, Italy',type:'Conference',coordinates:[45.8833,8.5333]}
];

const newConfs = newConfsRaw.map(c => ({
  id: c.id,
  name: c.name,
  type: c.type,
  location: c.location,
  coordinates: c.coordinates,
  eventDateStart: `${c.year}-06-15`,
  eventDateEnd: `${c.year}-06-16`,
  deadline: `${c.year}-03-01`,
  description: c.type,
  website: '#',
  topics: ['Past Event']
}));

fs.writeFileSync('src/data/conferences.json', JSON.stringify([...data, ...newConfs], null, 2));
console.log('Done!');
