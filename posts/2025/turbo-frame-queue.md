# Simple Turbo Frame Queue Loading

### Why? What problem is this solving? Why not just use `loading="lazy"` ?

We had a table on a dashboard where each row was fairly expensive to load, so we want to be able to control the number of rows that are loaded concurrently.

We've already split each row into a turbo frame so they can be loaded as separate requests (and disposed of the initial html <table> because they cause nothing but headaches!)

Setting turbo's loading to lazy will load each frame when it appears in the viewport, this works great for infinity scroll pagination, but all of the data we want to show is going to be on the first page, that initial loading is where we want to slow things down. When there could be 20+ requests at the same time.

### How?

When a turbo frame loads, it triggers a `turbo:frame-load` event that we can listen for, when we see that event we can trigger the next frame to load by setting it's `src` attribute.

HTML row partial
``` html
<div class="tbody"
     data-controller="turbo-frame-queue-loading"
     data-turbo-frame-queue-loading-max-concurrent-value="3">
  <% @franchise.organisations.each do |organisation| %>
    <turbo-frame id="organisation_<%= organisation.id %>_row"
                 data-src="<%= franchise_franchisee_metrics_path(@franchise, organisation_id: organisation.id, date_month: params[:date_month]) %>"
                 data-turbo-frame-queue-loading-target="frame"
                 class="tr">
      <div class="td organisation-col"><%= organisation.name %></div>
      <div class="td">Loading...</div>
    </turbo-frame>
  <% end %>
</div>
```

Stimulus Controller
``` js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    static targets = ["frame"]
    static values = { maxConcurrent: Number }

    get maxConcurrent() {
        return this.hasMaxConcurrentValue ? this.maxConcurrentValue : 3
    }

    connect() {
        this.loading = 0
        this.queue = [...this.frameTargets]
        console.log("queue", this.queue)
        this.loadNext()
    }

    loadNext() {
        while (this.loading < this.maxConcurrent && this.queue.length > 0) {
            const frame = this.queue.shift()
            if (!frame.hasAttribute("src")) {
                frame.setAttribute("src", frame.dataset.src)
                this.loading++
                console.log(`Loading frame: ${frame.id}, current loading count: ${this.loading}`)

                frame.addEventListener("turbo:frame-load", () => {
                    this.loading--
                    console.log(`Frame loaded: ${frame.id}, current loading count: ${this.loading}`)
                    this.loadNext()
                }, { once: true })
            }
        }
    }
}

```

With a 1s delay between each load, and the queue size set to 1s, it looks like this:

![Turbo Frame Loading Queue Gif](/assets/images/turbo-frame-queue.gif)

