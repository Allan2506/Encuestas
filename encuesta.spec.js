const { test, expect } = require('@playwright/test');

test('Flujo completo encuesta McDonalds', async ({ page }) => {
  // 1. Abrir encuesta
  await page.goto('https://mcexperienciasurvey.com/?AspxAutoDetectCookieSupport=1');

  // 2. País México
console.log("Paso: Seleccionando país México");
// marcar el radio
await page.click('input[name="Index_CountryPicker"][value="12"]');
await expect(page.locator('input[name="Index_CountryPicker"][value="12"]')).toBeChecked();

// esperar que el botón esté habilitado
await page.waitForSelector('#NextButton:not([disabled])');

// click en el botón
await page.click('#NextButton');

// esperar que desaparezca el radio del país (transición)
await page.waitForSelector('input[name="Index_CountryPicker"][value="12"]', { state: 'detached' });

// ahora esperar el campo de código restaurante
await page.waitForSelector('#InputAcronym');



  // 3. Código restaurante + fecha + hora (mismo paso)
  console.log("Paso: Llenando código, fecha y hora");
  await page.fill('#InputAcronym', '0133');
  await expect(page.locator('#InputAcronym')).toHaveValue('0133');

  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  const año = String(hoy.getFullYear()).slice(-2);
  const fechaHoy = `${mes}/${dia}/${año}`;
  await page.fill('#Index_VisitDateDatePicker', fechaHoy);

  await page.selectOption('#InputHour', String(hoy.getHours()).padStart(2, '0'));
  await page.selectOption('#InputMinute', String(hoy.getMinutes()).padStart(2, '0'));

  await Promise.all([
    page.waitForSelector('input[name="R000001"][value="1"]'),
    page.click('#NextButton'),
  ]);

  // 4. Mostrador
  console.log("Paso: Seleccionando mostrador");
  await page.check('input[name="R000001"][value="1"]', { force: true });
  await Promise.all([
    page.waitForSelector('input[name="R000002"][value="1"]'),
    page.click('#NextButton'),
  ]);

  // 5. Consumir dentro
  console.log("Paso: Seleccionando consumir dentro");
  await page.check('input[name="R000002"][value="1"]', { force: true });
  await Promise.all([
    page.waitForSelector('input[name="R000003"][value="2"]'),
    page.click('#NextButton'),
  ]);

  // 6. No
  console.log("Paso: Seleccionando No");
  await page.check('input[name="R000003"][value="2"]', { force: true });
  await Promise.all([
    page.waitForSelector('input[name="R000004"][value="5"]'),
    page.click('#NextButton'),
  ]);

  // 7. Muy satisfecho general
  console.log("Paso: Seleccionando Muy satisfecho general");
  await page.check('input[name="R000004"][value="5"]', { force: true });
  await Promise.all([
    page.waitForSelector('input[name="R000009"][value="5"]'),
    page.click('#NextButton'),
  ]);

  // 8. Calidad: marcar todos en Muy satisfecho
  console.log("Paso: Marcando todas las preguntas de calidad en Muy satisfecho");
  const radios = page.locator('input[name="R000009"][value="5"]');
  for (let i = 0; i < await radios.count(); i++) {
    await radios.nth(i).check({ force: true });
  }
  await Promise.all([
    page.waitForSelector('input[name="R000013"][value="1"]'),
    page.click('#NextButton'),
  ]);

  // 9. Sí entregaron tal cual pedido
  console.log("Paso: Seleccionando Sí entregaron tal cual pedido");
  await page.check('input[name="R000013"][value="1"]', { force: true });
  await Promise.all([
    page.waitForSelector('input[name="R000015"][value="5"]'),
    page.click('#NextButton'),
  ]);

  // 10. Muy posiblemente
  console.log("Paso: Seleccionando Muy posiblemente");
  await page.check('input[name="R000015"][value="5"]', { force: true });
  await Promise.all([
    page.waitForSelector('input[name="R000016"][value="10"]'),
    page.click('#NextButton'),
  ]);

  // 11. Recomendaría totalmente (10)
  console.log("Paso: Seleccionando Recomendaría totalmente (10)");
  await page.check('input[name="R000016"][value="10"]', { force: true });
  await Promise.all([
    page.waitForSelector('#S000019'),
    page.click('#NextButton'),
  ]);

  // 12. Mensaje libre
  console.log("Paso: Escribiendo mensaje libre");
  await page.fill('#S000019', 'Muy Satisfecho B');
  await Promise.all([
    page.waitForSelector('input[name="R000020"][value="2"]'),
    page.click('#NextButton'),
  ]);

  // 13. No tuve problemas en la visita
  console.log("Paso: Seleccionando No tuve problemas en la visita");
  await page.check('input[name="R000020"][value="2"]', { force: true });
  await Promise.all([
    page.waitForSelector('#S000036'),
    page.click('#NextButton'),
  ]);

  // 14. Datos personales
  console.log("Paso: Llenando datos personales");
  await page.fill('#S000036', 'Abraham');
  await page.fill('#S000035', '3325148760');
  await page.fill('#S000033', 'abraham124@gmail.com');
  await page.fill('#S000034', 'abraham124@gmail.com');
  await Promise.all([
    page.waitForSelector('input[name="R000040"][value="2"]'),
    page.click('#NextButton'),
  ]);

  // 15. Confirmación final "No"
  console.log("Paso: Seleccionando confirmación final No");
  await page.check('input[name="R000040"][value="2"]', { force: true });
  await Promise.all([
    page.waitForSelector('#NextButton'),
    page.click('#NextButton'),
  ]);

  // 16. Pantalla final
  console.log("Paso: Llegando a pantalla final");
  await page.screenshot({ path: 'pantalla_final.png' });
  console.log(`Encuesta completada correctamente hasta la pantalla final con fecha ${fechaHoy}`);
});
