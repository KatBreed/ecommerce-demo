import React from 'react'

const CoverImageShow = (props) => {
  return (
    <div>
      <h3>Cover Image</h3>
      <img src={props.record.params.coverImage} alt="Cover" width="200" />
    </div>
  )
}

export default CoverImageShow
