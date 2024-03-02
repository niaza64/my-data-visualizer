
import React, {useState} from "react";

import FileUploader from "./components/FileUploader"
import GraphDisplay from "./components/GraphDisplay"
import GraphSelector from "./components/GraphSelector"
import DataSummary from "./components/DataSummary"


const App = () => {

  const [uploadedData, setUploadedData] = useState(null);
  const [selectedGraphType, setSelectedGraphType] = useState("line");

  const handleDataUpload = (data) => {
    console.log("iamdata", data);
    setUploadedData(data);
  };
  const handleGraphTypeSelection = (type) => {
    setSelectedGraphType(type);
  };
  return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
        <p className="text-center text-gray-700 mb-6">
          Upload your Excel file to visualize the data.
        </p>
        <FileUploader onColumnSelectForVisual ={handleDataUpload} />
        </div>
      </div>
  )
}
export default App;