# Job Finder Thingy

Yo! So this is my Job Finder app—nothing fancy, just a little project i hacked together to find jobs worldwide. pulls from remoteok mostly and i tossed in some fake ones to spice it up. took forever to get the filters right, ugh.

## whats it do?
- grabs job listings from that remoteok api (free, thank god)
- added my own sample jobs—got stuff from africa to antarctica, ha!
- filter it by:
  - continents (europe, asia, remote, whatever)
  - categories like IT or marketing or whatever i called em
  - companies—dropdown or type it, your call
- click a job and bam, details pop up on the right

## setting it up
ok heres the deal to get it running:

1. **files u need**
   - snatch `index.html`, `style.css`, `script.js`. keep em in a folder together or it’ll freak out

2. **run it**
   - i use `npx http-server` (node.js thing) but u can just open the html in a browser if ur lazy. api might whine about cors tho

3. **internet**
   - gotta be online for the api bit—`https://remoteok.io/api`. if it craps out, u still get my backup jobs

4. **fire it up**
   - go to `localhost:8080` or wherever it lands. jobs should show up if i didnt screw it up

## using it
- **filters**: pick a continent or category or company from the dropdowns. text box works too if u half-remember a company name
- **search**: hit "Search Jobs" and pray it finds something
- **details**: click a job, see the deets—company, where it is, what it’s about, apply link
- **no jobs?**: says "No luck, try something else!"—just mess with the filters til u hit gold

## how its built
heres the mess i made—i mean, the structure:

- **`index.html`**
  - the bones of it all. got the layout with a header, search box, job list, and details spot. dropdowns and a button live here too

- **`style.css`**
  - makes it look less like garbage. grids and shadows and stuff—spent way too long tweaking colors

- **`script.js`**
  - the brains, if u can call it that. fetches jobs, filters em, slaps em on the page. full of console logs coz i kept breaking it

- **no folders or nuthin**
  - just these 3 files in one spot. didnt bother with fancy structure—its small enough, right?

## what i built it with
- html/css—basic stuff, made it look decent with some shadows and junk
- js—does the heavy lifting, fetching and filtering. looks like i wrote it half asleep
- remoteok api—free jobs, mostly remote but some real places too

## random notes
- api loves remote gigs, so my fake jobs fill in weird spots like antarctica (penguin jobs??)
- console’s full of logs—helps me figure out what i broke
- company filter’s got both dropdown and text coz i couldn’t pick one
- locations might get funky—keeps saying "Dunno" for stuff i didnt map right
- oh yeah, descriptions in my sample jobs are dumb—deal with it

## stuff to fix later
- maybe a spinner coz "grabbing jobs..." is boring
- figure out those dumb locations that dont work
- more apis? this one’s ok but could use more juice

## thx to
- remoteok for not making me fake everything
- my cat for sitting on my keyboard and “helping”

if u got ideas or it breaks, lemme know. or dont, i might be passed out. have fun!