import { useContext, useState } from "react";
import { AuthContext } from "../components/auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  ToolButton,
  DeleteIcon,
  RegenerateIcon,
  DownloadMergedFile,
  DownloadRawFile,
  LogOutIcon,
  FileInput,
  uploadIcon,
} from "./DashboardUI/UI";


const BASE_API_URL = "http://localhost:3000/api"

const navigation = [
  { name: "Dashboard", href: "/", current: false },
  { name: "Merging Tool", href: "/tool", current: true },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function FileUpload() {
  const navigate = useNavigate();
  const { logoutSuccess, getUserFromToken } = useContext(AuthContext);
  const user = getUserFromToken();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [folderFile, setFolderFile] = useState(String(""));

  
  const handleFileChange = (event) => {
    setSelectedFiles([...event.target.files]);
    // console.log("handlefilechange->", [...event.target.files]);
  };
  
  const handleFileUpload = async () => {
    const formData = new FormData();

    for (const file of selectedFiles) {
      formData.append("data", file);
      // console.log("file of selectedfiles ->", file);
    }

    await axios
      .post(`${BASE_API_URL}/tools/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${Cookies.get("userAuthToken")}`,
        },
      })
      .then((response) => {
        setFolderFile(response["data"]["folder"]);
        alert("Files uploaded successfully");
        setSelectedFiles([]); // once it shows that files are uploaded, it should remove the selected files to merge so that it doesn't confuse the user
      })
      .catch((error) => {
        console.error("Error uploading files:", error);
      });
  };

  const handleFileDownload = async (folderpath) => {
    const pythonScript = await executePythonScript(folderpath);

    await axios
      .get(`${BASE_API_URL}/tools/mergedFile/${folderpath}`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${Cookies.get("userAuthToken")}`,
        },
        responseType: "arraybuffer",
      }) //we need to use arraybuffer
      .then((response) => {
        // Create a Blob from the response data
        // blob = binary large object -> often used for handling files
        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });

        // Create a temporary URL for the blob -> blob is to bridge the gap between binary data and browser interacts
        const blobUrl = URL.createObjectURL(blob);

        // Create a link element and simulate a click to trigger download
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = "Merged File.xlsx"; // Set the desired filename
        link.click();

        // Clean up the temporary URL -> to prevent memory leak
        URL.revokeObjectURL(blobUrl);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const executePythonScript = async () => {
    const response = await axios
      .post(
        // "https://asia-southeast1-seif-project-4-excel.cloudfunctions.net/merge_excel_files",
        "https://asia-southeast1-seif-project-4-excel.cloudfunctions.net/mergeexcelfiles",
        { folderFile: folderFile },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("userAuthToken")}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-200">
          {/* {({ open }) => ( */}
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* <div className="flex h-16 items-center justify-between"> */}
                <div className="flex h-16 items-center justify-center">
                  <div className="flex items-center">
                    <div className="flex items-baseline content-center">
                      {/* <div className="ml-10 flex items-baseline space-x-4"> */}
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            onClick={() => navigate(item.href)}
                            // href={item.href}
                            className={classNames(
                              item.current
                                ? "bg-gray-900 text-white"
                                : "text-slate-600 hover:bg-gray-700 hover:text-white",
                              "rounded-md px-3 align-middle py-2 text-sm font-medium w-96 text-center"
                            )}
                            aria-current={item.current ? "page" : undefined}
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                    <div className = "text-emerald-00">{user.name}</div>
                      <Menu as="div" className="relative ml-3">
                        <div>
                          <Menu.Button
                            className="relative flex max-w-xs items-center rounded-full bg-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                            onClick={logoutSuccess}
                          >
                            {LogOutIcon()}
                          </Menu.Button>
                        </div>
                      </Menu>
                    </div>
                  </div>
                </div>
              </div>
            </>
          {/* )} */}
        </Disclosure>
        {/* 
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Merging Tool
            </h1>
          </div>
        </header> */}
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <div className="container mx-auto max-width:1280px">
              <p>Upload the excel files you would like to merge</p>

              {/* <div class="container mx-auto max-width:1280px"> */}
              <div class="flex flex-row">
                <ToolButton onClick={handleFileUpload}>
                  {uploadIcon()}
                </ToolButton>
                <FileInput onChange={handleFileChange}></FileInput>
              </div>

              {/* <input type="file" onChange={handleFileChange} multiple></input> */}

              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Attachments
                </dt>
              </div>

              {selectedFiles.map((file, index) => (
                <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <ul
                    role="list"
                    className="divide-y divide-gray-100 rounded-md border border-gray-200"
                  >
                    <li key = {index} className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                      <div className="flex w-0 flex-1 items-center">
                        <PaperClipIcon
                          className="h-5 w-5 flex-shrink-0 text-gray-400"
                          aria-hidden="true"
                        />
                        {/* <div className="ml-4 flex min-w-0 flex-1 gap-2"> */}
                          <span className="truncate font-medium">
                            {file.name}
                          </span>
                          <span className="flex-shrink-0 text-gray-400">{`${(
                            file.size /
                            (1024 * 1024)
                          ).toFixed(2)}mb`}</span>
                        {/* </div> */}
                      </div>
                    </li>
                  </ul>
                </dd>
              ))}
            </div>
            <div className= "py-4">
              <ToolButton onClick={() => handleFileDownload(folderFile)}>
                Download Merged File
              </ToolButton>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
