import React from "react";

import styles from "../styles/list.module.css";

interface Props {
  items: string[],
  columns?: 1 | 2
}

const List: React.SFC<Props> = ({ items, columns }) => (
  <div className={styles.container}>
    {
      Array(columns).fill(0).map((column, idx) => {
        const lowerLimit = idx * Math.ceil(items.length / columns);
        const upperLimit = (idx + 1) * Math.ceil(items.length / columns);
        console.log(lowerLimit, upperLimit)
        return (
          <div className={styles.column}>
            {
              items
                .slice(lowerLimit, upperLimit)
                .map((item: string, idx: number) => (
                  <div className={styles.item}>
                    {item}
                  </div>
                )
              )
            }
          </div>
        )
      })
    }
  </div>
)

List.defaultProps = {
  columns: 1
}

export default List;