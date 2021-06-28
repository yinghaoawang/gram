import React, {useState} from 'react';
import {Link} from "react-router-dom";
import './PostModalParts.css';
import {Dots} from "../../../Common/Parts";
import ModalOptions from "../../../Common/ModalOptions";

const printDate = (date) => {
    let d = new Date(date);
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
}
const printDateDiff = (startDate, endDate) => {
    const diffInMs   = new Date(endDate) - new Date(startDate)
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    return Math.floor(diffInDays);
}

const ModalButtonLeft = (props) => {
    return <div className="modal-button modal-left-button">
        {
            props.postIndex > 0 ? (<i ref={props.innerRef} onClick={props.onClick} className="fas fa-chevron-left"></i>)
                : (<i style={{opacity: 0}} className="fas fa-chevron-left click-through"></i>)
        }
    </div>;
}

const ModalButtonRight = (props) => {
    return <div className="modal-button modal-right-button">
        {
            props.postIndex < props.maxIndex ? <i ref={props.innerRef} onClick={props.onClick} className="fas fa-chevron-right"></i>
                : (<i style={{opacity: 0}} className="fas fa-chevron-left click-through"></i>)
        }

    </div>;
}

const InfoboxTextAreaLoader = (props) => {
    return (<>{
        props.loading &&
        <div className={"infobox-textarea-loading " + (props.useVertical ? 'vertical' : '')}>
            <div className="floatingBarsG">
                <div className="blockG" id="rotateG_01"></div>
                <div className="blockG" id="rotateG_02"></div>
                <div className="blockG" id="rotateG_03"></div>
                <div className="blockG" id="rotateG_04"></div>
                <div className="blockG" id="rotateG_05"></div>
                <div className="blockG" id="rotateG_06"></div>
                <div className="blockG" id="rotateG_07"></div>
                <div className="blockG" id="rotateG_08"></div>
            </div>
        </div>
    }</>);
};

const InfoboxAddCommentArea = (props) => {
    return <div className={"infobox-add-comment infobox-center-items " + (props.useVertical ? 'vertical' : '')}>
        <textarea className={"infobox-textarea comment-font " + (props.commentBeingPosted ? 'comment-posting ' : '') + (props.useVertical ? 'vertical ' : '')} spellCheck="false" ref={props.innerRef}  placeholder="Add a comment..."></textarea>

        <InfoboxTextAreaLoader useVertical={props.useVertical} loading={props.commentBeingPosted} />

        <a onClick={e => props.postCommentFn(props.innerRef.current.value)} className={"infobox-post-button unselectable" + ((props.commentBeingPosted || props.currUser == null) && " disabled")}>Post</a>
    </div>;
}

const InfoboxButtonsArea = props => {
    return <div className={"infobox-buttons infobox-center-items " + (props.useVertical ? 'vertical ' : '')}>
        <i onClick={props.toggleLikeFn} className={(props.userLikesPost ? "post-liked fas" : "far") + " fa-lg fa-heart"}></i>
        <i onClick={props.clickCommentBtnFn} className="far fa-lg fa-comment"></i>
    </div>;
}

const InfoboxLikesArea = props => {
    return <div className={"infobox-likes infobox-bold infobox-center-items " + (props.useVertical ? 'infobox-border-bottom vertical ' : '')} >
        {props.currPost.likes.length} likes
    </div>;
}

const InfoboxDateArea = props => {
    return <div className={"infobox-date infobox-center-items infobox-border-bottom " + (props.useVertical ? 'vertical ' : '')}>
        {printDate(props.currPost.created_at)}
    </div>;
}

const InfoboxDetailsArea = props => {
    return <>
        <InfoboxButtonsArea toggleLikeFn={props.toggleLikeFn} userLikesPost={props.userLikesPost} clickCommentBtnFn={props.clickCommentBtnFn} />
        <InfoboxLikesArea currPost={props.currPost} />
        <InfoboxDateArea currPost={props.currPost} />
    </>;
}

const InfoboxScrollingCommentsArea = props => {
    return <div className={"infobox-scrolling-comments " + (props.useVertical ? 'vertical ' : 'infobox-border-bottom ')}>
        {props.currCommentsLoaded ?
            <div className={"infobox-comment-container " + (props.useVertical ? 'vertical ' : '')} ref={props.innerRef}>
                {
                    props.currPost.comments.map(comment => {
                        if (comment.user == null) return '';
                        return (
                            <div key={"post"+props.currPost.id+"comment"+comment.id} className="infobox-comment">
                                <div className="infobox-comment-left">
                                    <Link to={'/user/' +comment.user.id} onClick={(e) => {e.preventDefault(); window.location.href='/user/' +comment.user.id}}>
                                        <img src={comment.user.pfp_url}></img>
                                    </Link>
                                </div>
                                <div style={{display:"inline"}} className="infobox-comment-right comment-font">
                                    <Link to={'/user/' +comment.user.id} onClick={(e) => {e.preventDefault(); window.location.href='/user/' +comment.user.id}}>
                                        <span className="infobox-bold">{comment.user.username}</span>
                                    </Link>&nbsp;<span>{comment.message}</span>

                                    <div className="infobox-comment-date">{printDateDiff(comment.created_at, Date.now())}d</div>
                                </div>
                                {false &&<div className="infobox-comment-right-margin"> <i className="far fa-xs fa-heart"></i></div> }
                            </div>
                        );
                    })
                }
            </div>:
            (<div className="loading" style={{display:'flex', alignItems:'center'}}>
                <div className="loader-xsmall"></div>
            </div>)}

    </div>
}

const InfoboxPostUserHeaderArea = props => {
    const [showModal, setShowModal] = useState(false);

    const closeModalOptions = () => {
        setShowModal(false);
        document.body.style.removeProperty('overflow');
    }
    const openModalOptions = () => {
        document.body.style.overflow = "hidden";
        setShowModal(true);
    }
    return <>
        {props.user &&
        <div className={"infobox-header " + (props.useVertical ? 'vertical ' : '')}>
            <Link to={'/user/' + props.user.id} className="infobox-link infobox-bold infobox-center-items"
                  onClick={e => {
                      e.preventDefault();
                      window.location.href = '/user/' + props.user.id
                  }}>
                <img className="infobox-pfp" src={props.user.pfp_url}></img>
                <span className="infobox-username">{props.user.username}</span>
            </Link>
            <div className="infobox-dots-holder"><Dots onClick={openModalOptions}/></div>
            {
                showModal && <ModalOptions onClose={closeModalOptions} show={showModal}/>
            }
        </div>
        }

    </>;
}

const PostContentVertical = props => {
    return <div className="vertical-post-inner">
        <div onClick={e => {console.log("TODO remove this"); if (props.currPost) console.log(props.currPost.ranking)}} style={{opacity: 0, position: 'absolute'}}>Ranking:{props.currPost && props.currPost.ranking}</div>
        <div className="vertical-post-inner-top">
            <div className="infobox-top infobox-border-bottom vertical">
                <InfoboxPostUserHeaderArea useVertical={true} user={props.user} />
            </div>

        </div>
        <div className="vertical-post-inner-middle">
            <img className="vertical post-img" src={props.currPost != null ? props.currPost.img_url : ''}></img>
        </div>
        <div className="vertical-post-inner-bottom">

            <div className={"infobox-bottom vertical"}>
                {props.currPost && <>
                    <InfoboxButtonsArea useVertical={true} toggleLikeFn={props.toggleLikeFn} userLikesPost={props.userLikesPost} clickCommentBtnFn={props.clickCommentBtnFn} />
                    <InfoboxLikesArea useVertical={true} currPost={props.currPost} />
                    <InfoboxScrollingCommentsArea useVertical={true} innerRef={props.scrollBoxRef} currPost={props.currPost} currCommentsLoaded={props.currCommentsLoaded} />
                    <InfoboxDateArea useVertical={true} currPost={props.currPost} />
                    <InfoboxAddCommentArea useVertical={true} postCommentFn={props.postCommentFn} commentBeingPosted={props.commentBeingPosted} innerRef={props.postBoxRef} currUser={props.currUser} />
                </>
                }
            </div>
        </div>

    </div>
}

const PostContent = props => {
    return <div className="post-inner">
        <div onClick={e => {console.log("TODO remove this"); if (props.currPost) console.log(props.currPost.ranking)}} style={{opacity: 0, position: 'absolute'}}>Ranking:{props.currPost && props.currPost.ranking}</div>
        <div ref={props.innerLeftRef} className="post-inner-left">
            <img className="post-img" src={props.currPost != null ? props.currPost.img_url : ''}></img>
        </div>
        <div ref={props.innerRightRef} className="post-inner-right">
            <div className="infobox-top infobox-border-bottom">
                <InfoboxPostUserHeaderArea user={props.user} />

            </div>
            <div className="infobox-bottom">
                {props.currPost && <>
                    <InfoboxScrollingCommentsArea innerRef={props.scrollBoxRef} currPost={props.currPost} currCommentsLoaded={props.currCommentsLoaded} />
                    <InfoboxDetailsArea currPost={props.currPost} toggleLikeFn={props.toggleLikeFn} userLikesPost={props.userLikesPost} clickCommentBtnFn={props.clickCommentBtnFn} />
                    <InfoboxAddCommentArea postCommentFn={props.postCommentFn} commentBeingPosted={props.commentBeingPosted} innerRef={props.postBoxRef} currUser={props.currUser} />
                </>
                }
            </div>
        </div>

    </div>
}

export {
    ModalButtonLeft, ModalButtonRight,
    InfoboxPostUserHeaderArea, InfoboxScrollingCommentsArea, InfoboxDetailsArea, InfoboxAddCommentArea, InfoboxTextAreaLoader,
    PostContent, PostContentVertical
};