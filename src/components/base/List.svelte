<script>
  export let columns = 1
  export let items = []
</script>

<style>
  .container {
    display: flex;
    align-self: flex-start;
    margin-left: 30px;
  }

  .column {
    display: flex;
    flex-direction: column;
  }

  .column:not(:first-child) {
    margin-left: 160px;
  }

  @media (max-width: 650px) {
    .column:not(:first-child) {
      margin-left: 80px;
    }
  }

  .item {
    position: relative;
    margin: 5px 0;
  }

  .item:before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border: 4px solid transparent;
    border-left-color: #ea5455;
    border-left-width: 6px;
    left: -20px;
    top: 9px;
  }
</style>

<div class="container">
  {#each Array(columns) as column, idx}
    <div class="column">
      {#each items.slice(idx * Math.ceil(items.length / columns), (idx + 1) * Math.ceil(items.length / columns)) as item}
        <div class="item">{item}</div>
      {/each}
    </div>
  {/each}
</div>
