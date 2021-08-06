import React from "react"
import { navigate } from "gatsby"
import { sample } from "lodash"

const isBrowser = typeof window !== "undefined"

const redirect = ({ pageContext }) => {
  isBrowser && navigate(sample(pageContext.pages))

  return <></>
}

export default redirect
