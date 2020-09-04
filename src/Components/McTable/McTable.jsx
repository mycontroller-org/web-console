import React from "react"

export const McHeader = ({text, align}) =>{
    const styles = {
        fontSize:"24px"
    }
    if (align !== undefined){
        styles["textAlign"] = align
    }
return <span style={styles}>{text}</span>
}