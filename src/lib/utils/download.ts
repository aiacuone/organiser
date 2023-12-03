export function downloadAsCSV(text: string, fileName = 'logs') {
	const csvContent = `data:text/csv;charset=utf-8,${encodeURIComponent(text)}`;

	const link = document.createElement('a');
	link.setAttribute('href', csvContent);
	link.setAttribute('download', `${fileName}.csv`);

	link.click();
}
