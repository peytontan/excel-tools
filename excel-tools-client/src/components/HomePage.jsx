import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/auth/AuthProvider";
import Cookies from "js-cookie";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import {
  ToolButton,
  DeleteIcon,
  RegenerateIcon,
  DownloadMergedFile,
  DownloadRawFile,
  LogOutIcon,
} from "./DashboardUI/UI";


const navigation = [
  { name: "Dashboard", href: "/", current: true },
  { name: "Merging Tool", href: "/tool", current: false },
];


// const BASE_API_URL = "http://localhost:3000/api"
const BASE_API_URL = "https://excel-tools.onrender.com/api"



function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Login() {
  const navigate = useNavigate();
  const { logoutSuccess, getUserFromToken } = useContext(AuthContext);
  const user = getUserFromToken();
  const [excelFiles, setExcelFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = excelFiles.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(excelFiles.length / itemsPerPage);

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  

  const getFilesInDb = async () => {
    await axios
    .get(`${BASE_API_URL}/tools/files`, {
      headers: { Authorization: `Bearer ${Cookies.get("userAuthToken")}` },
    })
    .then((res) => {
      setExcelFiles(res.data);
    })
    .catch((error) => {
      console.error(error);
    });
  }

  useEffect(()=>{
    getFilesInDb()
  },[])
  

  const handleDelete = async (assetId) => {
    await axios
      .delete(`${BASE_API_URL}/tools/deleteFile/${assetId}`, {
        headers: { Authorization: `Bearer ${Cookies.get("userAuthToken")}` },
      })
      .then((res) => {
        console.log(res);
        getFilesInDb()
      })
      .catch((error) => {
        console.error("Error deleting file:", error);
      });
  };

  const handleRawFileDownload = async (publicId, fileName) => {
    await axios
      .get(`${BASE_API_URL}/tools/rawFile/${publicId}`, {
        headers: { Authorization: `Bearer ${Cookies.get("userAuthToken")}` },
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
        link.download = `${fileName}`; // Set the desired filename
        link.click();

        // Clean up the temporary URL -> to prevent memory leak
        URL.revokeObjectURL(blobUrl);
      })
      .catch((error) => {
        console.error(error);
        alert("Raw File Not Found");
      });
  };

  const handleMergedFileDownload = async (folderpath) => {
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
        alert("Requested File Not Found");
      });
  };

  const executePythonScript = async (folder) => {
    const response = await axios
      .post(
        // "https://asia-southeast1-seif-project-4-excel.cloudfunctions.net/merge_excel_files",
        "https://asia-southeast1-seif-project-4-excel.cloudfunctions.net/mergeexcelfiles",
        { folderFile: folder },
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
        <Disclosure as="nav" className="bg-slate-200">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-center">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {/* <img
                        className="h-8 w-8"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                        alt="Your Company"
                      /> */}
                    </div>
                    <div className="hidden md:block">
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
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      <div>{user.name}</div>
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
          )}
        </Disclosure>

        {/* <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Dashboard
            </h1>
          </div>
        </header> */}
        <main>
          <div className="flex justify-center mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <table className="container mx-auto max-width:1280px">
                      <thead className="font-semibold dark:border-neutral-500">
                        <tr>
                          <th
                            scope="col"
                            className="py-4 text-center"
                          >
                            File Name
                          </th>
                          <th
                            scope="col"
                            className="py-2 px-4 text-center"
                          >
                            Created At
                          </th>
                          <th
                            scope="col"
                            className="py-2 px-4 text-center"
                          >
                            Session Id
                          </th>
                          <th
                            scope="col"
                            className="py-2 px-4 text-center"
                          >
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* {excelFiles.map((file, index) => ( */}
                        {currentItems.map((file, index) => (
                          <tr
                          className="transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-zinc-200"
                            key={index}
                          >
                            {/* <tr class="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-zinc-300" key={index}> */}
                            <td className="py-2 px-4 whitespace-nowrap text-center">
                              {file.fileName}
                            </td>

                            <td className="py-2 px-4 whitespace-nowrap text-center">
                              {new Date(
                                new Date(file.createdAt).toISOString()
                              ).toLocaleString("en-GB")}
                            </td>
                          

                            <td className="py-2 px-4 whitespace-nowrap text-center">
                              {file.folderPath.split("/")[1]}
                            </td>

                            <td className="py-2 px-4 flex justify-center space-x-0">
                              <ToolButton
                                onClick={() =>
                                  handleDelete(
                                    encodeURIComponent(file.filePublicId)
                                  )
                                }
                              >
                                {DeleteIcon()}
                              </ToolButton>
                              <ToolButton
                                onClick={() =>
                                  handleRawFileDownload(
                                    encodeURIComponent(file.filePublicId),
                                    file.fileName
                                  )
                                }
                              >
                                {DownloadRawFile()}
                              </ToolButton>
                              <ToolButton
                                onClick={() =>
                                  handleMergedFileDownload(
                                    file.folderPath.split("/")[1]
                                  )
                                }
                              >
                                {DownloadMergedFile()}
                              </ToolButton>
                              {/* need to use encodeURIComponent or else we will be seeing / in the params instead of %2F */}

                              <ToolButton
                                onClick={() =>
                                  executePythonScript(
                                    file.folderPath.split("/")[1]
                                  )
                                }
                              >
                                {RegenerateIcon()}
                              </ToolButton>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
              </div>
        </main>

      </div>
        <div className="flex justify-center fixed bottom-52 w-full text-center bg-white">
          <div className="py-4">
          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => setCurrentPage(pageNumber)}
              className={`relative z-10 rounded-md inline-flex items-center px-4 py-2 text-sm font-semibold text-black focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-200 ${
                currentPage === pageNumber ? 'bg-gray-200' :  "bg-white"}`}
            >
              {pageNumber}
            </button>
          ))}
          </div>
        </div>
    </>
  );
}
