import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import "../css/upload-files.css";
import formatDateWithoutTime from '../formatDateWithoutTime';

const Gallery = () => {
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
    const [userUplodedFiles, setUserUplodedFiles] = useState([]);
    return (
        <>
            <Navbar />
            <div className="main-div">
                <div className="main-title">Files Uploaded By Residents</div>
                <div className="uf-content">
                    <div className="uf-content-div">

                        {userUplodedFiles.length > 0 ? userUplodedFiles.map(i => {
                            return (
                                <>
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
                                            Uploaded By: <span>{i.firstName} {i.lastName}</span>
                                        </div>
                                        <div>
                                            on {formatDateWithoutTime(i.uplodedDate)}
                                        </div>
                                    </div>
                                </>
                            )
                        }) : <div>Sorry, there were no files uploaded. Please upload files to share them with Lunamar</div>}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Gallery;