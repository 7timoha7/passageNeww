interface TableDataCell {
  value: string;
}

interface TableDataRow {
  cells: TableDataCell[];
}

interface TableData {
  rows: TableDataRow[];
}

// const { I } = inject();
//
// Given('I am on login page', () => {
//   I.amOnPage('/login');
// });
//
// When('I enter form fields:', (tableData: TableData) => {
//   tableData.rows.forEach(row => {
//     const [fieldName, fieldValue] = row.cells;
//     I.fillField(fieldName.value, fieldValue.value);
//   });
// });
//
// When('I click {string} button', (buttonName: string) => {
//   I.click(`//button[contains(text(),"${buttonName}")]`);
// });
//
// Then('I see {string} in user menu.', async (text: string) => {
//   const uppercaseText = 'Hello, ' + text;
//   I.waitForText(uppercaseText.toUpperCase());
// });
