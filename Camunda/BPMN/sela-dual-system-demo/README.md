# דמו סלא — אורקסטרציה בין פריוריטי ל-AS/400

חבילת Camunda 8.8 מלאה המבוססת על שלושת התהליכים במסמך האפיון:

| תהליך | BPMN | החלטה / טפסים |
|---|---|---|
| ריקול אצווה | `batch-recall.bpmn` | `recall-classification.dmn` ושלושה טפסים |
| קליטת SKU חדש | `sku-onboarding.bpmn` | חמישה טפסים |
| דיווח תופעת לוואי | `adverse-event-reporting.bpmn` | טופס השלמת פרטים |

כל תוויות התרשים בעברית. מזהים טכניים, שמות משתנים וסוגי job workers נשארו באנגלית כדי לשמור על אינטגרציה יציבה.

## חוזי workers

ה-BPMN מגדיר job types בלבד; המימושים החיצוניים אינם חלק מהחבילה. הרשימה המלאה נגזרת מ-`zeebe:taskDefinition` בקובצי ה-BPMN. הכשל המתוכנן במוק AS/400 צריך להחזיר failure ל-worker `as400-create-item`, כך ש-Camunda תפתח Incident ותאפשר Retry רק לפעילות שנכשלה.

## משתני כניסה מרכזיים

- ריקול: `recallId`, `batchNumber`, `productName`, `defectType`, `targetPopulation`, `recallTargets`.
- SKU: נשלחים מטופס ההתחלה; משימות האישור מחזירות `regulatoryApproved`, `storageApproved`, `pricingApproved`.
- תופעת לוואי: `reportId`, `productCode`, `detailsComplete` ופרטי המדווח/אירוע.

## אימות

```bash
npm install
npm run validate:forms
npx --yes dmnlint recall-classification.dmn
c8ctl bpmn lint batch-recall.bpmn
c8ctl bpmn lint sku-onboarding.bpmn
c8ctl bpmn lint adverse-event-reporting.bpmn
```
