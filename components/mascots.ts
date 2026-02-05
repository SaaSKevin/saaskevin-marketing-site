export const MASCOTS = {
  heroDomain: "/mascots/Make_it_proudly_hold_variation.png",
  plugIn: "/mascots/Make_it_plug_in_a_ca_variation.png",
  pointAtUI: "/mascots/Make_it_point_at_a_U_variation.png",
  checkVerified: "/mascots/Make_it_place_a_chec_variation.png",
  dnsWatcher: "/mascots/Make_it_watching_a_D_variation.png",
  guardLock: "/mascots/Make_it_guard_a_lock_variation.png",
  peekLaptop: "/mascots/Make_it_peek_from_th_variation.png",
  guidingTraffic: "/mascots/Make_it_fading_into__variation.png",
  directingTraffic: "/mascots/Make_it_directing_tr_variation.png",
  lounging: "/mascots/Make_it_lounging_com_variation.png",
  sitConfident: "/mascots/Make_it_sit_confiden_variation.png",
  waveHello: "/mascots/Make_it_wave_hello_variation.png",
  working: "/mascots/Make_it_working_behi_variation.png",
  confused: "/mascots/Make_it_confused_but_variation.png",
  zenFade: "/mascots/Make_it_fading_into__variation.png",
  pricingMascot: "/mascots/Make_it_lounging_com_variation.png",
  cloudflareSignin: '/mascots/Make_the_cat_hugging_variation.png'
} as const

export type MascotName = keyof typeof MASCOTS
export type MascotSrc = (typeof MASCOTS)[MascotName]

