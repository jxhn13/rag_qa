
import React from "react"

export default function ButtonTab({onSubmit})
{
    return (
        <div className="submit-button">
            <button type="button" onClick={onSubmit}>SUBMIT</button>
        </div>
    )
}