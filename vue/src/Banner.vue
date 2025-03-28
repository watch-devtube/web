<template>
  <div class="super-banner">
    <div class="super-gradient-bg super-gradient-left"></div>
    <div class="super-gradient-bg super-gradient-right"></div>

    <div>
      <div class="super-logo-container">
        <img class="super-logo" src="https://dev.events/logos/eduardsi.png"
          alt="The Principal Dev – Masterclass for Tech Leads">
      </div>
    </div>

    <p class="super-text">
      <a class="super-link" href="https://principal.dev">The Principal Dev – Masterclass for Tech Leads</a>
      • July 17-18
    </p>
    <a class="super-cta-button" href="https://principal.dev">Join →</a>
  </div>
</template>
<style>
.super-banner {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  overflow: hidden;
  background: black;
  padding: 0.625rem 1.5rem;
  color: white;
}

.super-gradient-bg {
  position: absolute;
  top: 50%;
  width: 100%;
  height: 100%;
  opacity: 0.3;
  transform: translateY(-50%);
  filter: blur(50px);
  background: linear-gradient(to right, #ff80b5, #9089fc);
  pointer-events: none;

}

.super-gradient-left {
  left: max(-7rem, calc(50% - 52rem));
}

.super-gradient-right {
  left: max(45rem, calc(50% + 8rem));
}

.super-logo-container {
  position: relative;
  width: 32px;
  height: 32px;
}

.super-logo-container::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  box-shadow: 0 3px 0 0 rgba(225, 131, 194, 0.25),
    0 -3px 0 0 rgba(165, 181, 222, 0.25),
    3px 0 0 0 rgba(225, 131, 194, 0.25),
    -3px 0 0 0 rgba(165, 181, 222, 0.25),
    3px -1px 0 0 rgba(195, 156, 208, 0.5),
    -3px 3px 0 0 rgba(195, 156, 208, 0.5),
    3px 3px 0 0 rgba(255, 105, 180, 0.75),
    -3px -3px 0 0 rgba(135, 206, 235, 0.75);
  animation: super-spin 1s linear infinite;
}

@keyframes super-spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.super-logo {
  height: 100%;
  width: 100%;
  border-radius: 50%;
}

.super-text {
  font-size: 0.875rem;
  line-height: 1.5;
}

.super-link {
  font-weight: bold;
  text-decoration: none;
  color: white;
}

.super-link:hover {
  color: white;
}

.super-cta-button {
  flex-shrink: 0;
  border-radius: 9999px;
  background: #1f2937;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: bold;
  color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.super-cta-button:hover {
  transition: all 0.2s;
  background: white;
}
</style>
