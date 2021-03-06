import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import { addPost } from '../../actions/postActions'; 
import GeoLocation from '../common/geolocated';
 

class PostForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      postImage: null, 
      uploadProgress: 0,
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.uploadHandler = this.uploadHandler.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.errors) {
      this.setState({ errors: newProps.errors });
    }
    const { postUploadProgress } = this.props.post;
    this.setState({
      uploadProgress: postUploadProgress
    });
  }

  uploadHandler(e){   
    this.setState({
       postImage: e.target.files[0]
    });
    
   }
 
   onChange(e) { 
     this.setState({ [e.target.name]: e.target.value });
   }

  onSubmit(e) {
    e.preventDefault();
    

    const { user } = this.props.auth; 
    const newPost = new FormData();
    newPost.append('text', this.state.text);
    newPost.append('postImage', this.state.postImage, this.state.postImage.name); 
    newPost.append('name', user.name);
    newPost.append('avatar', user.avatar);
    
    // const newPost = {
    //   text: this.state.text,
    //   postImage: formData,
    //   name: user.name,
    //   avatar: user.avatar
    // };
  
    this.props.addPost(newPost);
    
    this.setState({ text: '', postImage: null});
  }
 

  render() {
    const { errors, uploadProgress } = this.state;  
    
    
    return (
      <div> 
      {/* <!-- New Post Modal Trigger --> */}
        <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
          New Post 
        </button>
        {/* <!-- New Post Modal --> */}
        <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Report Something</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {/* Form Body */}
                <div className="post-form mb-3">
                    <div className="card card-info">
                      <div className="card-header bg-info text-white">Say Something....</div>
                      <div className="card-body">
                        <form onSubmit={this.onSubmit} encType='multipart/form-data'>
                          <div className="form-group">
                            <TextAreaFieldGroup
                              placeholder="Create a post"
                              name="text"
                              value={this.state.text}
                              onChange={this.onChange}
                              error={errors.text}
                            />
                          </div>
                          <div className="input-group mb-3">
                            <div className="input-group-prepend">
                              <span className="input-group-text" id="inputGroupFileAddon01">Upload</span>
                            </div>
                            <div className="custom-file">
                              <input type="file" className="custom-file-input" name="postImage" onChange={this.uploadHandler}/>
                              <label className="custom-file-label">Choose file</label>
                            </div>
                          </div>
                           {/* TODO: Optimpize this progress bar */}
                           <div className="progress">
                              <div className="progress-bar" role="progressbar" style={{width: uploadProgress +"%"}} aria-valuenow={uploadProgress} aria-valuemin="0" aria-valuemax="100">{uploadProgress}</div>
                            </div>
                            <br/>
                          <GeoLocation/>
                          <button type="submit" className="btn btn-dark">
                            Submit
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
              </div>
              <div className="modal-footer">
                <div>Thanks for supporting Encrypto</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  post: state.post,
  errors: state.errors
});

export default connect(mapStateToProps, { addPost })(PostForm);
