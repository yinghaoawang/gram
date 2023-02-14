import React from 'react';
import './UserPostUpload.css';
import AuthContext from "../../AuthContext";

const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
const apiPath = '/api';

class UserPostUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            draggingOverUploadArea: false,
            imageBase64: null,
            imageFile: null,
            loadingFile: false,
            postBeingUploaded: false,
        };
        this.unloadImage = this.unloadImage.bind(this);
        this.onDragOverUploadArea = this.onDragOverUploadArea.bind(this);
        this.onDragLeaveUploadArea = this.onDragLeaveUploadArea.bind(this);
        this.onDropUploadArea = this.onDropUploadArea.bind(this);
        this.handleUploadButtonClick = this.handleUploadButtonClick.bind(this);
        this.onChangeFile = this.onChangeFile.bind(this);
        this.uploadPost = this.uploadPost.bind(this);
        this.fileUploadRef = React.createRef();
        this.imagePreviewRef = React.createRef();
    }

    static contextType = AuthContext;

    componentDidUpdate() {
        if (this.context.userLoaded && this.context.currUser == null) {
            this.props.history.push('/gram/login');
        }
    }

    unloadImage() {
        this.setState({imageBase64: null, imageFile: null})
    }

    onDragOverUploadArea(e) {
        e.preventDefault();
        this.setState({draggingOverUploadArea: true});
    }

    onDragLeaveUploadArea(e) {
        e.preventDefault();
        this.setState({draggingOverUploadArea: false});
    }

    onDropUploadArea(e) {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            let file = e.dataTransfer.files[0];
            this.handleFile(file);
            e.dataTransfer.clearData();
        }
        this.setState({draggingOverUploadArea: false});
    }

    handleUploadButtonClick(e) {
        e.preventDefault();
        this.fileUploadRef.current.click();
    }

    async handleFile(file) {
        if (this.state.loadingFile) return;
        console.log(file);
        console.log(file.type);
        if (!validImageTypes.includes(file.type)) {
            console.error("invalid file type: " + file.type);
            return;
        }
        let reader = new FileReader();
        await this.setState({loadingFile: true});
        reader.onload = async e => {
            //await new Promise(resolve => setTimeout(resolve, 500000));
            console.log("loaded");
            await this.setState({imageBase64: reader.result, imageFile: file});
            await this.setState({loadingFile: false});
            this.imagePreviewRef.current.src = e.target.result;
            this.imagePreviewRef.current.onload = e => {
                if (this.imagePreviewRef.current.naturalHeight == 0) {
                    this.unloadImage();
                }
            };
            this.imagePreviewRef.current.onerror = (async e => {
                console.error("image preview load error");
                alert('Image preview failed to load');
                await this.setState({loadingFile: false});
                this.unloadImage();
            })

        }
        reader.onerror = e => {
            console.error("reader load error");
            alert('Image preview failed to load');
            this.unloadImage();
        }
        reader.onprogress = (event) => {
            if (event.lengthComputable) {
                let progress = ((event.loaded / event.total) * 100);
                console.log(progress);
            }
        };
        reader.readAsDataURL(file);
    }

    onChangeFile(event) {
        event.stopPropagation();
        event.preventDefault();

        let file = event.target.files[0];
        this.handleFile(file);
    }

    async uploadPost(e) {
        e.preventDefault();
        if (this.state.postBeingUploaded) return;
        let currUser = this.context.currUser;
        if (currUser == null) return;
        this.setState({postBeingUploaded: true})
        //await new Promise(resolve => setTimeout(resolve, 3000));
        console.log("uploading to imgur");
        let url = apiPath + '/posts/create';
        let data = {user_id: currUser.id, image_base64: this.state.imageBase64}
        await fetch(url, {
            method: "POST",
            body: new URLSearchParams(data),
        }).then(async res => {
            console.log(res);
            if (res.ok) {
                console.log('OK', res);
                let data = await res.json();
                console.log(data);
                window.history.pushState(null, null, `/gram/post/${data.post.id}`)
                window.location.reload();
            } else {
                console.error('NOT OK');
                alert("Error: Unable to upload image or create post");
            }

            this.setState({postBeingUploaded: false})
        }).catch(err => {
            console.error('err', err);
            this.setState({postBeingUploaded: false})
            alert("Error: Unable to upload image or create post");
        });
    }

    render() {
        let currUser = this.context.currUser;

        return (
            <div className="content" onDrop={this.onDropUploadArea} onDragOver={e => {e.preventDefault()}} onDragLeave={e => {e.preventDefault()}}>
                <div className="upload-image-outer-container">
                    <div className="upload-image-container">
                        <div className={"upload-image-first " + (this.state.imageFile ? 'uploaded' : '')}>
                            { !this.state.imageFile && !this.state.loadingFile ?
                                <div onDrop={this.onDropUploadArea} onDragOver={this.onDragOverUploadArea} onDragLeave={this.onDragLeaveUploadArea}
                                     className={"upload-image-outline " + (this.state.imageFile ? 'uploaded' : '')  + (this.state.draggingOverUploadArea ? ' item-over ' : '')}>
                                    <div className={"upload-image-first-top "}>
                                        <div className="upload-image-first-top-inner unselectable">
                                            <div className="upload-circle">
                                                <i className="fas fa-2x fa-upload"></i>
                                            </div>

                                            <span>Drop Image Here</span>
                                            <span>or</span>
                                            <span><button className="choose-photo-button"
                                                onClick={this.handleUploadButtonClick}>Choose Photo</button></span>
                                            <input onChange={this.onChangeFile} type="file" ref={this.fileUploadRef}
                                                   style={{display: "none"}}/>
                                        </div>
                                    </div>
                                </div>
                                :
                                <>{
                                    this.state.loadingFile ?
                                        <div className={"loading"}>
                                            <div className="loader"></div>
                                        </div>
                                        : <div className="img-container">
                                            <img ref={this.imagePreviewRef}/>
                                            <div className="img-close"><i onClick={this.unloadImage}
                                                                          className="fas fa-2x fa-times"></i></div>
                                        </div>
                                }</>
                            }
                        </div>
                        <div className="upload-image-second">
                            <form className="upload-form">
                                <label htmlFor="uf-description">Description<span className="optional"> - Optional</span></label>
                                <span>Include a brief description about your post where it will be located in the comments area in your post.</span>
                                <textarea id="uf-description"></textarea>
                                <span className="note"><strong>Note -</strong> gram will resize your images if they exceed the standard maximum size.</span>

                                <button onClick={this.uploadPost} className={"upload-form-post-button unselectable " + (this.state.imageFile ? '' : 'disabled ')}>Post</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default UserPostUpload;
