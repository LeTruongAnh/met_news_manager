import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import CustomSelect from "components/CustomInput/CustomSelect.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";

import axios from 'axios'
import config from '../../config.js'
import style from '../../style.js'

const styles = {
  cardCategoryWhite: {
  color: "rgba(255,255,255,.62)",
  margin: "0",
  fontSize: "14px",
  marginTop: "0",
  marginBottom: "0"
  },
  cardTitleWhite: {
  color: "#FFFFFF",
  marginTop: "0px",
  minHeight: "auto",
  fontWeight: "300",
  fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  marginBottom: "3px",
  textDecoration: "none"
  }
};

class Post extends React.Component {
  constructor(props) {
  super(props)
  this.state = {
    newsCategories: "",
    newsSite: "",
    newsTitle: "",
    newsCategoriyList: [],
    newsTags: "",
    newsDecriptions: "",
    newsImage: "",
    listCategory: [],
    loading: true
  }
  }
  componentDidMount = () => {
    axios.get(`${config.apiBaseURL}/api/news/${this.props.newsID}`)
    .then((response) => {
      let newsTags = response.data.keywords.toString()
      this.setState({
        newsTitle: response.data.title,
        newsDecriptions: response.data.description,
        newsTags: newsTags,
        newsSite: response.data.site,
        newsImage: response.data.thumbnail,
        loading: false
      })
    })
    .catch((error) => {
      console.log(error)
      this.setState({ loading: false})
    })
    axios.get(`${config.apiBaseURL}/api/news/category`)
    .then((response) => {
      let listCategory = response.data.items.map(x => {
        return {
          value: x.id,
          text: x.name
        }
      })
      this.setState({
        listCategory: listCategory
      })
    })
    .catch((error) => {
      console.log(error)
    })
  }
  handleClickAddImage = () => {
    document.getElementById('input-image').click()
  }
  handleAddImage = (selectorFiles) => {
    if (selectorFiles.length > 0) {
      if (selectorFiles[0].name.endsWith(".gif") || selectorFiles[0].name.endsWith(".jpg") || selectorFiles[0].name.endsWith(".jpeg") || selectorFiles[0].name.endsWith(".tiff") || selectorFiles[0].name.endsWith(".png")) {
        this.setState({
          errAddImage: ""
        })
        this.setState( {loading: true} )
        var file = selectorFiles[0]
        var reader = new FileReader()
        reader.onloadend = () => {
          axios.post(`${config.apiBaseURL}/api/stadium/upload`, {
            "image": reader.result,
            "stadiumID": this.state.userInfo.default_stadium_id
          }, {
            'headers': {
              'Authorization': this.state.userInfo.token,
              'Content-Type': 'application/json'
            }
          })
          .then((response) => {
            let lst = [...this.state.imageList, response.data.url]
            this.props.handleAddImage(lst)
            this.setState({
              imageList: lst,
              loading: false,
              errAddImage: ""
            })
          })
          .catch((error) => {
            console.log(error)
            this.setState( {loading: false} )
          })
        }
        reader.readAsDataURL(file)
      }
    }
  }
  handleChange = (e) => this.setState({ [e.target.id]: e.target.value })
  handleChangeSelect = (e) => this.setState({ [e.target.name]: e.target.value })
  render() {
    const { classes } = this.props;
    const optionsSite = [
      {
        value: "abc",
        text: "abc"
      },
      {
        value: "all",
        text: "all"
      },
      {
        value: "xyz",
        text: "abc"
      }
    ]
    return (
    <div>
      <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
        <CardHeader color="primary">
          <h4 className={classes.cardTitleWhite}>Đăng tin</h4>
        </CardHeader>
        <CardBody>
          <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <CustomInput
            handleChange={this.handleChange}
            value={this.state.newsTitle}
            labelText="Tiêu đề"
            id="newsTitle"
            formControlProps={{
              fullWidth: true
            }}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={12}>
            <CustomInput
            value={this.state.newsTags}
            handleChange={this.handleChange}
            labelText="Gắn thẻ"
            id="newsTags"
            formControlProps={{
              fullWidth: true
            }}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={12}>
            <CustomInput
            value={this.state.newsDecriptions}
            handleChange={this.handleChange}
            labelText="Mô tả"
            id="newsDecriptions"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              multiline: true,
              rows: 3
            }}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <CustomSelect
            value={this.state.newsCategories}
            lstItem={this.state.listCategory}
            handleChangeSelect={this.handleChangeSelect}
            labelText="Loại tin tức"
            id="newsCategories"
            formControlProps={{
              fullWidth: true
            }}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={8}>
            <CustomSelect
            value={this.state.newsSite}
            lstItem={optionsSite}
            handleChangeSelect={this.handleChangeSelect}
            labelText="Trang"
            id="newsSite"
            formControlProps={{
              fullWidth: true
            }}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={12}>
            <GridContainer>
              <Grid item xs={12} sm={4} md={4}>
                <GridContainer>
                  <Grid item style={style.padding0} xs={12} sm={12} md={12}>
                    <div style={style.divAsLabel}>Hình ảnh</div>
                  </Grid>
                  <Grid item style={style.padding0} xs={12} sm={12} md={12}>
                    <Button onClick={this.handleClickAddImage}>Đăng ảnh</Button>
                    <input style={style.displayNone} id="input-image" ref={this.textInput}
                    onChange={ (e) => this.handleAddImage(e.target.files)} type="file" />
                  </Grid>
                </GridContainer>
              </Grid>
              <Grid item style={style.padding0} xs={12} sm={8} md={8}>
                <img alt="" style={style.maxWidth100} src={this.state.newsImage}/>
              </Grid>
            </GridContainer>
          </GridItem>
          </GridContainer>
        </CardBody>
        <CardFooter>
          <Button color="primary">Đăng tin tin</Button>
        </CardFooter>
        </Card>
      </GridItem>
      </GridContainer>
    </div>
    );
  }
}

export default withStyles(styles)(Post);
