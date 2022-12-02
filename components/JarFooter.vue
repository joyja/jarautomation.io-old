

<template>
  <footer class="footer">
    <div class="footer__social space-x-6">
      <a style="display: none;" href="https://linktr.ee/joycubed" class="social__link" target="_blank">
        <span class="sr-only">Linktree</span>
        <svg
          class="social"
          fill="currentColor"
          viewBox="0 0 191.72301 234.17000"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M.366 79.15h57.917l-41.24-39.027 22.73-23.162 39.23 40.123V0h34.09v57.084l39.22-40.123 22.73 23.162-41.24 39.028h57.92v32.28h-58.29l41.43 40.123-22.73 22.615-56.27-56.354-56.27 56.354-22.73-22.615 41.42-40.123H0v-32.28Zm78.817 78.422h34.09v76.598h-34.09z"
          />
        </svg>
      </a>

      <a href="https://www.linkedin.com/company/jarautomation/" class="social__link" target="_blank">
        <span class="sr-only">LinkedIn</span>
        <svg
          class="social"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
          />
        </svg>
      </a>

      <a href="https://github.com/joyja" class="social__link" target="_blank">
        <span class="sr-only">GitHub</span>
        <svg class="social" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill-rule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clip-rule="evenodd"
          />
        </svg>
      </a>
    </div>
    <div>
      <p class="copyright">&copy; {{ new Date().getFullYear() }} JAR Automation, LLC All rights reserved.</p>
    </div>
  </footer>
</template>

<style scoped>
/* md */
@media (min-width: 768px) {
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .footer__social {
    order: 2;
  }
  .copyright {
    margin-top: calc(0 * var(--spacing-unit)) !important;
    order: 1;
  }
}
.footer {
  height: 60px;
  position: absolute;
  bottom: 0px;
  left: 0px;
  right: 0px;
  font-family: Basic;
  margin-left: auto;
  margin-right: auto;
  padding-top: calc(2 * var(--spacing-unit));
  padding-bottom: calc(2 * var(--spacing-unit));
  padding-right: calc(4 * var(--spacing-unit));
  padding-left: calc(4 * var(--spacing-unit));
}
.footer__social {
  display: flex;
  justify-content: center;
}
.social {
  height: 1.5rem;
  width: 1.5rem;
}
.social__link {
  /* display: flex;
  flex-direction: column;
  justify-content: center; */
  transition: all .3s ease-out;
  color: var(--neutral-100);
}
.social__link:hover {
  color: var(--red-600);
}
.copyright {
  margin-top: calc(1 * var(--spacing-unit));
  text-align: center;
  font-size: medium;
  color: var(--gray-400);
}
</style>