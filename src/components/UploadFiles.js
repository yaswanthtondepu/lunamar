import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "../css/upload-files.css";
import { FiUpload } from 'react-icons/fi';
import { Link } from "react-router-dom";
import axios from "axios";
import formatDateWithoutTime from '../formatDateWithoutTime';
const UploadFiles = () => {
    let UPLOAD_ENDPOINT = 'https://vxt9613.uta.cloud/Lunamar-Management/php/uploadFile.php';
    let currentUser;
    if (window.sessionStorage.getItem("userDetails")) {
        currentUser = JSON.parse(window.sessionStorage.getItem("userDetails"));
    }
    let currentRole;
    if (currentUser) {
        currentRole = currentUser.role
    }
    else {
        currentRole = null;
    }
    useEffect(() => {
        getUserUplodedFiles();
    }, []);
    async function getUserUplodedFiles() {
        const config = {
            method: 'get',
            url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/getUserUploadedFiles.php'
        }

        let res = await axios(config)
        setUserUplodedFiles(res.data);
    }
    const [file, setFile] = useState("");
    const [selectedFile, setSelectedFile] = useState([]);
    const [userUplodedFiles, setUserUplodedFiles] = useState([]);
    const handleChange = (e) => {
        setFile(URL.createObjectURL(e.target.files[0]));
        setSelectedFile(e.target.files[0]);
    }

    async function uploadFile(e) {
        e.preventDefault();
        if (selectedFile.length === 0) {
            alert("Please select a file to upload");
        }
        else {
            if (selectedFile.size <= 2097152) {
                let files = selectedFile.type.split("/");
                let fileType = files[0];
                if (fileType === "image" || fileType === "video") {
                    const formData = new FormData();

                    formData.append('avatar', selectedFile)
                    let res = await axios.post(UPLOAD_ENDPOINT, formData, {
                        headers: {
                            'content-type': 'multipart/form-data'
                        }
                    });
                    if (res.data.status === "success" && res.data.message === "File uploaded successfully") {
                        axios({
                            method: 'post',
                            url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/uploadFileDetails.php',
                            headers: {
                                'content-type': 'application/json'
                            },
                            data: { fileName: selectedFile.name, filePath: res.data.url, uploadedBy: currentUser.userId, fileType: fileType, type: selectedFile.type }
                        })
                            .then(result => {
                                if (result.data === "success") {
                                    alert("File uploaded successfully.")
                                    setFile('');
                                    setSelectedFile([]);
                                }
                                else {
                                    alert("Something went wrong.");

                                }
                            })
                            .catch(error => console.log(error));
                    }
                    else {
                        console.log(res.data);
                        alert("something went wrong.please try again.")
                    }
                }
                else {
                    alert("Please upload only images or videos.");
                }
            } else {
                alert("File size can't exceed 2MB");
            }
        }

    };
    return (
        currentRole === "Resident" ?
            <>
                <Navbar />
                <div className="main-div">
                    <div className="main-title">Upload photos/videos</div>
                    <div className="uf-content">
                        <div className="upload-div">
                            <div style={{ paddingBottom: "1rem" }}> Upload files to share with Lunamar</div>
                            <form onSubmit={uploadFile}>
                                <div className="input-div">
                                    <div>
                                        <label className="custom-file-upload">
                                            <input type="file" required onChange={handleChange} />
                                            <FiUpload /> Choose Image/Video
                                        </label>
                                    </div>
                                    <div>
                                        <button type="submit" className="btn-upload">Upload</button>
                                    </div>
                                </div>

                            </form>
                            <div style={{ paddingTop: "2rem" }} className="image-preview">
                                <div > <img alt='' src={file} className="uploaded-image" /></div>
                                <div style={selectedFile != "" ? { display: "flex", flexDirection: "column", justifyContent: "center" } : { display: "none" }}>
                                    <div>File Details:</div>

                                    <div>File Name: {selectedFile.name}</div>


                                    <div>File Type: {selectedFile.type}</div>
                                </div>
                            </div>

                        </div>
                        <div style={{ display: "flex", justifyContent: "center", fontWeight: "600", paddingTop: "1rem" }}>Files Uploaded by Residents</div>
                        <div className="uf-content-div">

                            {userUplodedFiles.length > 0 ? userUplodedFiles.map(i => {
                                return (

                                    <div className="uf-display-file">
                                        <div>
                                            {i.fileType === "image" ?
                                                <img alt={i.fileName} src={i.fileUrl} className="uploaded-image"></img> :
                                                i.fileType === "video" ?
                                                    <video className="uf-video" controls>
                                                        <source src={i.fileUrl} type={i.type} />
                                                    </video>
                                                    :
                                                    <div></div>
                                            }
                                        </div>
                                        <div>
                                            Uploaded By: {i.uploadedBy == parseInt(currentUser.userId) ? "You" :
                                                <span>{i.firstName} {i.lastName}</span>}
                                        </div>
                                        <div>
                                            on {formatDateWithoutTime(i.uplodedDate)}
                                        </div>
                                    </div>

                                )
                            }) : <div>Sorry, there were no files uploaded. Please upload files to share them with Lunamar</div>}
                        </div>
                    </div>
                </div>
            </>
            :
            <>
                <div style={{ marginTop: "200px" }}>

                    You are not authorised to access this page. Please
                    <Link to="/login" style={{ color: "red" }}> login </Link> as Resident role to view this page.
                </div>
            </>
    )
}

export default UploadFiles;