import React from 'react'
import styles from './StatesBtn.module.css'

export const StateBtn = ({stateButton,changeState}) => {
  return (
    <div className={styles.states_button}>
        <button onClick={() => changeState(0)} className={stateButton === 0 ? styles.active : ''}>ADD</button>
        <button onClick={() => changeState(1)} className={stateButton === 1 ? styles.active : ''}>UPDATE</button>
        <button onClick={() => changeState(2)} className={stateButton === 2 ? styles.active : ''}>DELETE</button>
    </div>
  )
}

export default StateBtn