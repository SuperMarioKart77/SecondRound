"use client";

import { useEffect, useState } from 'react';
import { parseXmlData } from '../utils/parseXml';
import StockRow from '../components/StockRow';

const FetchStock = () => {
  const [stockData, setStockData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/stock'); // Updated fetch path to use Next.js API route
        const xmlText = await response.text();

        console.log('Raw XML:', xmlText); // Log the raw XML data

        // Remove any non-XML content before the XML declaration
        let cleanedXmlText = xmlText.replace(/^[\s\S]*?(<\?xml)/, '$1').trim();

        // Replace escaped quotes with regular quotes
        cleanedXmlText = cleanedXmlText.replace(/\\"/g, '"');

        console.log('Cleaned XML:', cleanedXmlText); // Log the cleaned XML data

        try {
          const result = await parseXmlData(cleanedXmlText) as any;
          console.log('Parsed XML:', result); // Log the parsed JSON data
          setStockData(result);
        } catch (parseError) {
          console.error('Error parsing cleaned XML:', parseError);
          setError(`Error parsing cleaned XML: ${parseError}`);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(`Error fetching data: ${err}`);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Aggregate data by code, but only take the first matching row
  const aggregatedData = stockData?.stocklevels?.stocklevel.reduce((acc: any, item: any) => {
    const code = item.$.code;
    if (!acc[code]) {
      acc[code] = { ...item.$ };
    }
    return acc;
  }, {});

  // Convert aggregated data to an array for easier pagination
  const aggregatedDataArray = Object.entries(aggregatedData || {}).map(([code, item]) => ({
    code,
    quantity: (item as any).quantity, // Ensure quantity is included
    ...(typeof item === 'object' ? item : {})
  }));

  // Sort the data by quantity in descending order
  aggregatedDataArray.sort((a, b) => parseInt(b.quantity, 10) - parseInt(a.quantity, 10));

  // Calculate total pages
  const totalPages = Math.ceil(aggregatedDataArray.length / itemsPerPage);

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = aggregatedDataArray.slice(indexOfFirstItem, indexOfLastItem);

  // Handler for next page
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  // Handler for previous page
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Stock Data</h2>

      {/* Stock Rows */}
      {currentItems.length > 0 ? (
        <div className="space-y-4">
          {currentItems.map((item: any, index: number) => (
            <StockRow
              key={`${item.code}-${index}`} // Ensuring unique keys
              name={item.name}
              salesprice={item.salesprice}
              quantity={item.quantity}
            />
          ))}
        </div>
      ) : (
        <p>No stock data available.</p>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 space-x-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-700 text-white'
          }`}
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-700 text-white'
          }`}
        >
          Next Page
        </button>
      </div>

      {/* Page Indicator */}
      <div className="text-center mt-2 text-gray-600">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

export default FetchStock;
