---
layout: default
title: Boyle's and Charles's Law Simulation (for grade 6 kids!)
category: Chemistry
---
# Boyle's Law and Charles' Law

## Boyle's Law

<canvas id="boyle">HTML5 canvas is not enabled in your browser!</canvas>

Molecule radius: <input type="number" id="boyleradius" value="5" min="1" max="15">
Molecule count: <input type="number" id="boylecount" value="100" min="1">

**IMPORTANT: Boyle's Law involves VOLUME and PRESSURE.**\
As you can see, when you are moving the piston up, essentially increasing the volume, the pressure goes down. This is because the particles now have more space to bounce inside, having less force to make the piston go up.\
On the contrary, if you lower the piston (decrease the volume) the pressure now increases because the particles have less space to bounce in, and they want more of it, forcing the piston to go up. You can still lower the piston at high pressures, but at a specific pressure you can't lower the piston anymore.\
Notice that when you muliply the volume and the pressure, **in this case the product is always 100**!

## Charles's Law

<canvas id="charles">HTML5 canvas is not enabled in your browser!</canvas>

Molecule radius: <input type="number" id="charlesradius" value="5" min="1" max="15">
Molecule count: <input type="number" id="charlescount" value="100" min="1">

**IMPORTANT: Charles' Law involves TEMPERATURE and VOLUME.**\
If you try out the structure and raise the temperature gauge, basically increasing the temperature, the volume goes up with it. You might also notice that there is a slight speedup in the speed of the particles, which is the cause of the increase in volume.\
On the other way, if you decrease the temperature the volume decreases with it because the particles now lose speed and push the piston less than before.\
Notice that when you divide the temperature by the volume, **in this case the quotient is always 5**! Also note that it doesn't matter in what way you set up your variables (temperature &#247; volume or volume &#247; temperature) as the constant (the variable that doesn't change) always stays the same.

## Practice Stuff

Use the above two programs to find the following:

1. (With the constant of 100) If the volume is 200, what is the pressure? <button onclick="reveal(this, 0.5)">A</button>
2. (With the constant of 100) At what volume will the pressure be 0.8? <button onclick="reveal(this, 125)">A</button>
3. (With the constant of 5) If the temperature is 295, what is the volume? <button onclick="reveal(this, 59)">A</button>
4. (With the constant of 5) At what temperature will the volume be 34? <button onclick="reveal(this, 170)">A</button>

---

*If you like this simulation and would like to save it to your device, feel free to use your browser's save page functionality.*\
*Want to see the original simulation I made in grade 10 in Java? [Click here!](/misc/scilaws/)*

<script type="text/javascript" src="scilaws-ng.js"></script>
