document.addEventListener('DOMContentLoaded', () => {
    const botonPDF = document.getElementById('boton-pdf');

    if (botonPDF) {
        botonPDF.addEventListener('click', async () => {
            try {
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF('p', 'pt', 'a4');

                // 1. Clonamos el contenido completo
                const contenedor = document.createElement('div');
                contenedor.className = 'pdf-container';

                // Clonamos todo excepto el footer y el botón
                const headerClone = document.querySelector('header').cloneNode(true);
                const mainClone = document.querySelector('main').cloneNode(true);

                // Aseguramos que "Observaciones:" sea visible
                const observaciones = mainClone.querySelector('.desborde');
                if (observaciones) {
                    observaciones.style.display = 'block';
                    observaciones.style.visibility = 'visible';
                    observaciones.style.opacity = '1';
                    observaciones.style.marginBottom = '50px';
                    observaciones.style.paddingBottom = '30px';
                }

                // Ocultamos solo el botón
                const botonClone = mainClone.querySelector('.botón_container');
                if (botonClone) {
                    botonClone.style.display = 'none';
                }

                // Ajustamos la visualización de los select
                const selects = headerClone.querySelectorAll('select');
                selects.forEach(select => {
                    select.style.height = 'auto';
                    select.style.minHeight = '30px';
                    select.style.overflow = 'visible';
                    select.style.position = 'relative';
                });

                // Corregimos el posicionamiento de los títulos
                const ajustarTitulos = (element) => {
                    const titulos = element.querySelectorAll('.titulo_info_basica, .titulo_tipo_retiro, .titulo_info_transaccional, .titulo_forma_retiro, .titulo_beneficiario, .titulo_firmas');
                    titulos.forEach(titulo => {
                        titulo.style.display = 'flex';
                        titulo.style.alignItems = 'center';
                        titulo.style.justifyContent = 'center';
                        titulo.style.minHeight = '35px';
                        titulo.style.padding = '5px 0';
                        titulo.style.whiteSpace = 'pre-wrap'; // Conserva espacios entre palabras
                        titulo.style.wordSpacing = '0.2em';  // Espaciado entre palabras
                        titulo.style.letterSpacing = '0.01em'; // Espaciado entre letras
                        titulo.style.borderBottom = '3px solid black';
                    });
                };

                // Aplicamos ajustes a los títulos tanto en header como en main
                ajustarTitulos(headerClone);
                ajustarTitulos(mainClone);

                contenedor.appendChild(headerClone);
                contenedor.appendChild(mainClone);
                document.body.appendChild(contenedor);

                // 2. Configuración de html2canvas
                const canvas = await html2canvas(contenedor, {
                    scale: 1.5,
                    useCORS: true,
                    windowWidth: contenedor.scrollWidth,
                    windowHeight: contenedor.scrollHeight,
                    onclone: function(clonedDoc) {
                        // Reemplazo de los select por divs con texto del valor seleccionado
                        const clonedSelects = clonedDoc.querySelectorAll('select');
                        clonedSelects.forEach(select => {
                            const selectedOption = select.options[select.selectedIndex];
                            const textNode = clonedDoc.createElement('div');
                            textNode.textContent = selectedOption ? selectedOption.text : '';
                            textNode.style.border = '1px solid #ccc';
                            textNode.style.padding = '5px 8px';
                            textNode.style.width = '100%';
                            textNode.style.boxSizing = 'border-box';
                            textNode.style.fontFamily = "'Sofia Sans', sans-serif";
                            textNode.style.fontSize = '1rem';
                            textNode.style.height = 'auto';
                            select.parentNode.replaceChild(textNode, select);
                        });

                        // Ajustes de espaciado para los títulos
                        const titulos = clonedDoc.querySelectorAll('.titulo_info_basica, .titulo_tipo_retiro, .titulo_info_transaccional, .titulo_forma_retiro, .titulo_beneficiario, .titulo_firmas');
                        titulos.forEach(titulo => {
                            titulo.style.whiteSpace = 'pre-wrap';
                            titulo.style.wordSpacing = '0.2em';
                            titulo.style.letterSpacing = '0.005em';
                        });
                    }
                });

                // 3. Limpieza
                document.body.removeChild(contenedor);

                // 4. Ajuste de márgenes para el PDF
                const margenLateral = 10;
                const margenSuperior = 7;
                const margenInferior = 7;

                const pdfWidth = pdf.internal.pageSize.getWidth() - (margenLateral * 2);
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                const pdfPageHeight = pdf.internal.pageSize.getHeight();

                if (pdfHeight + margenSuperior + margenInferior > pdfPageHeight) {
                    const escalaAjustada = (pdfPageHeight - margenSuperior - margenInferior) / pdfHeight;
                    const nuevoAncho = pdfWidth * escalaAjustada;
                    const nuevoAlto = pdfHeight * escalaAjustada;

                    pdf.addImage(
                        canvas.toDataURL('image/png'),
                        'PNG',
                        (pdf.internal.pageSize.getWidth() - nuevoAncho) / 2,
                        margenSuperior,
                        nuevoAncho,
                        nuevoAlto
                    );
                } else {
                    pdf.addImage(
                        canvas.toDataURL('image/png'),
                        'PNG',
                        margenLateral,
                        margenSuperior,
                        pdfWidth,
                        pdfHeight
                    );
                }

                pdf.save('Formato de Retiro.pdf');
            } catch (error) {
                console.error("Error:", error);
                alert("Error al generar PDF. Consulte la consola.");
            }
        });
    }
});

document.getElementById('monto_retiro').addEventListener('input', function(e) {
  let value = e.target.value.replace(/\D/g, '');
  e.target.value = new Intl.NumberFormat('es-MX').format(value);
});
