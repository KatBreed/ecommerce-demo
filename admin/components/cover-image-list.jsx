import React from 'react'

const CoverImageList = (props) => {
  return (
    <div>
      <img src={props.record.params.coverImage} alt="Cover" width="100" />
    </div>
  )
}

export default CoverImageList
