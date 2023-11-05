import React, { forwardRef } from 'react'

const Test1ChildComponent = (refA) => {
  return (
    <>
      <input className='rounded-xl border-slate-400 border-2'  ref={refA} />
    
    </>
  )
}

export default forwardRef(Test1ChildComponent)