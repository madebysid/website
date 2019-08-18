import React from "react";
import { StaticQuery, graphql } from "gatsby";
import Img from "gatsby-image";

import styles from "../styles/screenshots.module.css";

interface Props {
  active: string,
  onClose: (() => void)
}

const query = graphql`
  query {
    images: allFile(filter: { extension: { regex: "/png/" } }) {
      edges {
        node {
          extension
          relativePath
          childImageSharp {
            fluid(maxWidth: 1200) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`

const FullscreenImage: React.SFC<Props> = ({ active, onClose }) => {
  if (active === null) {
    return null;
  }

  return (
    <div className={styles.fullscreen}>
      <div className={styles.fullscreenBackground} onClick={onClose} />
      <StaticQuery query={query} render={({ images }) => {
        const image = images.edges.find(i => i.node.relativePath === active)
        return <Img className={styles.fullscreenImage} fluid={image.node.childImageSharp.fluid} />
      }}
      />
    </div>
  );
};

export default FullscreenImage;