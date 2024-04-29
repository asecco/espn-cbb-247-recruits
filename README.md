<p align="center">
  <a href="" rel="noopener">
 <img width=75px height=75px src="https://github.com/asecco/espn-cbb-247-recruits/assets/40510223/53753258-6bfe-444f-af45-453a56f47fcc" alt="Project logo"></a>
</p>

<h1 align="center">ESPN CBB 247 Recruits</h1>

<div align="center">

  [![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/asecco/espn-cbb-247-recruits/total)](https://github.com/asecco/espn-cbb-247-recruits/releases/latest)
  [![GitHub stars](https://img.shields.io/github/stars/asecco/espn-cbb-247-recruits)](https://github.com/asecco/espn-cbb-247-recruits/stargazers)
  [![GitHub Issues](https://img.shields.io/github/issues/asecco/espn-cbb-247-recruits.svg)](https://github.com/asecco/espn-cbb-247-recruits/issues)
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

<p align="center">
  <a href="#getting-started">Getting Started</a> •
  <a href="#limitations">Limitations</a>
</p>

---

<p align="center"> A simple browser script for passionate CBB fans to access 247Sports HS recruiting info effortlessly!
  <br> 
</p>
  
<p align="center">Like what you see? Please consider giving ESPN CBB 247 Recruits a GitHub star ⭐, it will help a lot!</p>

## Getting Started
### Installation
You can install the script as a **[Userscript](https://en.wikipedia.org/wiki/Userscript)** in all popular browsers. In the future, there may be other installation methods, such as browser extensions.

#### Userscript
1. Install a [Userscript Manager](https://en.wikipedia.org/wiki/Userscript_manager) of your choice, such as [Tampermonkey](https://www.tampermonkey.net/).
2. Install **ESPN CBB 247 Recruits** by clicking **[here](https://github.com/asecco/espn-cbb-247-recruits/releases/latest/download/espn-cbb-247-recruits.user.js)**.
3. Done! Browse a CBB player's ESPN page and view their HS recruit ranking.

![example](https://github.com/asecco/espn-cbb-247-recruits/assets/40510223/f8ce2998-6135-402c-8bcf-36d0ac3dc889)

## Limitations
Recruiting information is retrieved by scraping 247Sports annual composite recruit rankings, however, this comes with some known limitations.
- For efficiency in searching for a recruit's name in the rankings, I'm only looking through the first 5 pages(top 250 recruits). If you want to change this, replace the `maxPage` constant with a value of your choosing.
  - **There's a max of ~10 pages with 50 recruits per page**
    ```js
    const maxPage = 5;
    ```

- Inconsistencies in the recruit's name on ESPN and 247Sports may lead to the script not finding the recruit's ranking. Many differences are accounted for, such as **'John Doe Jr'** vs **'John Doe'** or **'A.J.'** vs **'AJ'**, which still lead to matches, but there are still rare exceptions where matching fails.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
