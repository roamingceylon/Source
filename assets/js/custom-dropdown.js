(function () {
  // 1) find your original UL
  const originalNav =
    document.querySelector("ul.nav") ||
    document.querySelector("ul.dropdown-nav");
  if (!originalNav) return;

  const items = Array.from(originalNav.children);
  const newNav = document.createElement("ul");
  newNav.classList.add("dropdown-nav");

  let currentMain = null;
  // temporary store of main items
  const groups = [];

  items.forEach((item) => {
    const text = item.textContent.trim();
    if (!text.startsWith("-")) {
      // start a new group
      const anchor = item.querySelector("a");
      if (!anchor) return;
      currentMain = {
        text: anchor.textContent.trim(),
        href: anchor.getAttribute("href"),
        subitems: [],
      };
      groups.push(currentMain);
    } else if (currentMain) {
      // sub-item of currentMain
      const subText = text.replace(/^- /, "");
      const anchor = item.querySelector("a");
      if (!anchor) return;
      currentMain.subitems.push({
        text: subText,
        href: anchor.getAttribute("href"),
      });
    }
  });

  // now build the new menu
  groups.forEach((group) => {
    const li = document.createElement("li");
    const anchor = document.createElement("a");
    anchor.textContent = group.text;
    anchor.href = group.href;
    li.appendChild(anchor);

    if (group.subitems.length) {
      // only these get a dropdown
      li.classList.add("has-dropdown");

      // add arrow via CSS pseudo-element
      // build the subnav
      const subnav = document.createElement("ul");
      subnav.classList.add("subnav");
      group.subitems.forEach((si) => {
        const subLi = document.createElement("li");
        const subA = document.createElement("a");
        subA.textContent = si.text;
        subA.href = si.href;
        subLi.appendChild(subA);
        subnav.appendChild(subLi);
      });
      li.appendChild(subnav);
    }

    newNav.appendChild(li);
  });

  originalNav.replaceWith(newNav);

  // 2) Mobile toggle logic only on true has-dropdown items
  const MOBILE_BREAK = 768;
  function bindToggles() {
    newNav.querySelectorAll("li.has-dropdown > a").forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        if (window.innerWidth <= MOBILE_BREAK) {
          e.preventDefault();
          anchor.parentElement.classList.toggle("open");
        }
      });
    });
  }
  bindToggles();

  window.addEventListener("resize", () => {
    if (window.innerWidth > MOBILE_BREAK) {
      newNav.querySelectorAll("li.open").forEach((li) => {
        li.classList.remove("open");
      });
    }
  });
})()