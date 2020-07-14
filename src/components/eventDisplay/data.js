import React, {useState, useEffect} from 'react'
import { Icon } from 'semantic-ui-react'
import history from '../../history'

const Data = (props) => {

  const handleDelete = () => {

    fetch(`http://localhost:5000/api/event/deleteData/${props.id}/${props.info.key}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    .then(res => res.json())
    .then(res => {
      if(res.message === 'Data Deleted'){
        window.location.reload(false);
      }
      else if(res.message === "Internal Server Error"){
        alert('An Error has Occured. Please Try Again.')
      }
      else if(res.message === "Auth Failed"){
        history.push('/login')
      }
    })
  }

  return(
    <div id = 'dataDiv' className = "paddingBottom20px">
      <h3 className = "colorWhite paddingLeft8Percent displayInline">{props.info.dataset}</h3>
      <div className = 'displayInline floatRight margin0 paddingRight10Percent fontSize25px colorWhite' >
        <Icon onClick = { () => handleDelete() } className = "pointer" name = 'trash alternate' />
      </div>
      <div className = 'displayInline floatRight margin0 paddingRight30px fontSize25px colorWhite'>
        <Icon onClick = { () => {
          props.setData(props.info)
          history.push(`/user/${props.id}/updateData/${props.info.key}`)
        }}
        className = "pointer" name = 'pencil' />
      </div>
      <p className = "colorWhite paddingLeft8Percent paddingBottom5px">{props.info.label}</p>
      <hr className = "margin0auto smallhr"></hr>
    </div>
  )
}

export default Data
