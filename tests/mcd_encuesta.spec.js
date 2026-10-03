const { test, expect } = require('@playwright/test');
test.use({ headless: true });
const NUMERO_DE_INTENTOS = 6;

for (let i = 1; i <= NUMERO_DE_INTENTOS; i++) {
  
  test(`Flujo completo encuesta - Intento ${i}`, async ({ page }) => {
    
    // Tiempo límite de 3 minutos
    test.setTimeout(180000); 

    console.log(`\n================================`);
    console.log(`🚀 INICIANDO INTENTO NÚMERO: ${i} (SIN PROXY)`);
    console.log(`================================\n`);

    try {
      await page.goto('https://mcexperienciasurvey.com/?AspxAutoDetectCookieSupport=1');
      await page.waitForTimeout(2000);

      console.log(`[Intento ${i}] Paso: Clic en botón Comenzar inicial`);
      await page.waitForSelector('#NextButton');
      await page.waitForTimeout(1500);
      await page.click('#NextButton');

      console.log(`[Intento ${i}] Paso: Seleccionando país México`);
      await page.waitForTimeout(2000);
      await page.click('label[for="Index_CountryPicker.12"]');
      await expect(page.locator('#Index_CountryPicker\\.12')).toBeChecked();
      await page.click('#NextButton');
      await page.waitForSelector('#InputAcronym');
      await page.waitForTimeout(2000);

      console.log(`[Intento ${i}] Paso: Llenando código restaurante`);
      await page.waitForTimeout(1000);
      await page.fill('#InputAcronym', '0133');
      await page.waitForTimeout(1000);
      await expect(page.locator('#InputAcronym')).toHaveValue('0133');

     console.log(`[Intento ${i}] Paso: Configurando FECHA y HORA`);
      await page.click('.ui-datepicker-trigger');
      await page.waitForSelector('.ui-datepicker');
      await page.waitForTimeout(1500);
      
      const ahora = new Date();
      let dia, hora, minuto;

      if (process.env.TIEMPO_OPCION === 'manual') {
        dia = String(process.env.DIA_MANUAL).trim();
        hora = String(process.env.HORA_MANUAL).padStart(2, '0');
        minuto = String(process.env.MINUTO_MANUAL).padStart(2, '0');
        console.log(`[Intento ${i}] Usando fecha MANUAL: Día ${dia} a las ${hora}:${minuto}`);
      } else {
        dia = ahora.getDate().toString();
        hora = String(ahora.getHours()).padStart(2, '0');
        minuto = String(ahora.getMinutes()).padStart(2, '0');
        console.log(`[Intento ${i}] Usando fecha ACTUAL: Día ${dia} a las ${hora}:${minuto}`);
      }

      // --- INICIO DE VALIDACIÓN DE MES ---
      // Localizamos el día en el calendario activo
      const diaLocator = page.locator('.ui-datepicker-calendar td a').getByText(dia, { exact: true }).first();

      // Si Playwright detecta que el día no existe o no está visible en la pantalla actual
      if (!(await diaLocator.isVisible())) {
          console.log(`[Intento ${i}] Día ${dia} no visible en el mes actual. Retrocediendo un mes...`);
          await page.click('span.ui-icon-circle-triangle-w');
          
          // Esperamos a que termine la animación de transición del calendario
          await page.waitForTimeout(1000);
      }

      // Hacemos clic en el día ya garantizando que está en pantalla
      await diaLocator.click();
      // --- FIN DE VALIDACIÓN DE MES ---

      await page.waitForTimeout(1000);
      await expect(page.locator('#Index_VisitDateDatePicker')).toHaveValue(/\d{2}\/\d{2}\/\d{2}/);
      
      await page.selectOption('#InputHour', hora);
      await page.waitForTimeout(800);
      await page.selectOption('#InputMinute', minuto);

      await page.click('#NextButton');
      await page.waitForSelector('label[for="R000001.1"]');
      await page.waitForTimeout(2000);

      console.log(`[Intento ${i}] Paso: Calificando servicio`);
      await page.waitForTimeout(1200);
      await page.click('label[for="R000001.1"]');
      await expect(page.locator('input[name="R000001"][value="1"]')).toBeChecked();
      await page.click('#NextButton');
      
      await page.waitForSelector('label[for="R000002.1"]');
      await page.waitForTimeout(2000);
      await page.click('label[for="R000002.1"]');
      await expect(page.locator('input[name="R000002"][value="1"]')).toBeChecked();
      await page.click('#NextButton');
      
      await page.waitForSelector('label[for="R000003.2"]');
      await page.waitForTimeout(2000);
      await page.click('label[for="R000003.2"]');
      await expect(page.locator('input[name="R000003"][value="2"]')).toBeChecked();
      await page.waitForSelector('#NextButton');
      await page.waitForTimeout(1500);
      await page.click('#NextButton');

      await page.waitForSelector('td[role="radio"][aria-labelledby="textR000004"]');
      await page.waitForTimeout(1200);
      await page.click('td[role="radio"][aria-labelledby="textR000004"]');
      await expect(page.locator('#R000004\\.5')).toBeChecked();
      await page.waitForSelector('#NextButton');
      await page.waitForTimeout(2000);
      await page.click('#NextButton');

      console.log(`[Intento ${i}] Paso: Marcando calidad en Muy satisfecho`);
      await page.waitForSelector('tr[id^="FNSR"]');
      const filasCalidad = await page.locator('tr[id^="FNSR"]').all();

      for (const fila of filasCalidad) {
        await page.waitForTimeout(1200);
        const celdaMuySatisfecho = fila.locator('td.Opt5.inputtyperbloption[role="radio"]');
        await celdaMuySatisfecho.click();
        const input = fila.locator('input[type="radio"][value="5"]');
        await expect(input).toBeChecked();
      }

      await page.waitForSelector('#NextButton');
      await page.waitForTimeout(2000);
      await page.click('#NextButton');

      await page.waitForSelector('td[role="radio"][aria-labelledby="textR000013"]');
      await page.waitForTimeout(1200);
      await page.click('td[role="radio"][aria-labelledby="textR000013"]');
      await expect(page.locator('input[name="R000013"][value="1"]')).toBeChecked();
      await page.waitForSelector('#NextButton');
      await page.waitForTimeout(2000);
      await page.click('#NextButton');

      await page.waitForSelector('label[for="R000015\\.5"]');
      await page.waitForTimeout(1200);
      await page.click('label[for="R000015\\.5"]');
      await expect(page.locator('#R000015\\.5')).toBeChecked();

      await page.waitForTimeout(1200);
      await page.click('label[for="R000016\\.10"]');
      await expect(page.locator('#R000016\\.10')).toBeChecked();
      await page.waitForSelector('#NextButton');
      await page.waitForTimeout(2000);
      await page.click('#NextButton');

      console.log(`[Intento ${i}] Paso: Escribiendo mensaje libre`);
      await page.waitForSelector('#S000019');
      await page.waitForTimeout(1500);
      
      const tipoUsuario = process.env.TIPO_USUARIO || 'B';
      const mensajePersonalizado = `Excelente calidad ${tipoUsuario}`;
      
      await page.fill('#S000019', mensajePersonalizado);
      console.log(`[Intento ${i}] Mensaje ingresado: "${mensajePersonalizado}"`);
      
      await page.waitForSelector('#NextButton');
      await page.waitForTimeout(2000);
      await page.click('#NextButton');

      await page.waitForSelector('td.Opt2.inputtyperbloption[role="radio"]');
      const noVisita = page.locator('td.Opt2.inputtyperbloption[role="radio"]').first();
      await page.waitForTimeout(1200);
      await noVisita.click();
      await expect(noVisita).toHaveAttribute('aria-checked', 'true');
      await expect(page.locator('#R000020\\.2')).toBeChecked();
      await page.waitForSelector('#NextButton');
      await page.waitForTimeout(2000);
      await page.click('#NextButton');

      const nombres = ['Allan', 'Mauricio', 'Hugo', 'Lesli', 'Miriam', 'Abraham', 'Carlos', 'Luis', 'Miguel', 'Jorge', 'Fernando', 'Samantha', 'Brayan', 'Joel', 'Alejandro', 'Ricardo', 'Daniel', 'Alejandro', 'Esau'];
      const apellidos = ['García', 'Martínez', 'Rodríguez', 'López', 'Hernández', 'González', 'Pérez', 'Sánchez', 'Ramírez', 'Nuñez', 'Corona', 'Salvador','Torres'];

      const nombre = nombres[Math.floor(Math.random() * nombres.length)];
      const apellido = apellidos[Math.floor(Math.random() * apellidos.length)];
      const telefono = '33' + Math.floor(10000000 + Math.random() * 90000000);
      const correo = `${nombre.toLowerCase()}${apellido.toLowerCase()}${Date.now()}@gmail.com`;

      const datos = { nombre, apellido, telefono, correo };

      console.log(`[Intento ${i}] Paso: Ingresando los datos generados (${datos.nombre} ${datos.apellido})`);
      await page.waitForTimeout(1000);

      await page.waitForSelector('#S000036');
      await page.locator('#S000036').fill(datos.nombre);
      await page.waitForTimeout(800);
      await page.locator('#S000028').fill(datos.apellido);
      await page.waitForTimeout(900);
      await page.locator('#S000035').fill(datos.telefono);
      await page.waitForTimeout(1100);
      await page.locator('#S000033').fill(datos.correo);
      await page.waitForTimeout(950);
      await page.locator('#S000034').fill(datos.correo);
      await page.waitForTimeout(1500);

      await page.click('#NextButton');
      await page.waitForTimeout(2000); 

      await page.waitForSelector('label[for="R000040\\.1"]');
      await page.waitForTimeout(1200);
      await page.click('label[for="R000040\\.1"]');
      await expect(page.locator('#R000040\\.1')).toBeChecked();
      await page.click('#NextButton');
      await page.waitForTimeout(2000);

      console.log(`[Intento ${i}] Paso: Capturando pantalla final`);
      await page.waitForTimeout(3000); 
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: `pantalla_final_intento_${i}.png`, fullPage: true });
      
      console.log(`✅ Intento ${i} completado con éxito.\n`);

    } catch (error) {
      console.log(`❌ Falló el intento ${i}.`);
      console.error(error.message);
    }
  });
}