export default defineAppConfig({
  ui: {
    card: {
      slots: {
        root: "rounded-[20px] ",
        header: "p-4 sm:px-6",
        body: "p-4 sm:p-6",
        footer: "p-4 sm:px-6",
      },
      variants: {
        variant: {
          solid: {
            root: "bg-card-gradient text-inverted",
          },
          outline: {
            root: "bg-default ring ring-default divide-y divide-default",
          },
          soft: {
            root: "bg-elevated/50 divide-y divide-default",
          },
          subtle: {
            root: "bg-elevated/50 ring ring-default divide-y divide-default",
          },
        },
      },
      defaultVariants: {
        variant: "outline",
      },
    },
    button: {
      slots: {
        base: [
          'rounded-md font-light  inline-flex items-center disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:opacity-75',
          'transition-colors'
        ],
        label: 'truncate ',
        leadingIcon: 'shrink-0',
        leadingAvatar: 'shrink-0',
        leadingAvatarSize: '',
        trailingIcon: 'shrink-0'
      },
      variants: {
         color: {
        primary: "",
        secondary: "",
        success: "",
        info: "!bg-[#008FEA] ",
        warning: "",
        error: "",
        neutral: "",
        gradient: "bg-gradient-to-br  from-light-gray to-dark-gray",
      },
        size: {
          xs: {
            base: " rounded-[10px] px-2 py-1 text-xs gap-1",
            leadingIcon: "size-4",
            leadingAvatarSize: "3xs",
            trailingIcon: "size-4",
          },
          sm: {
            base: "rounded-[10px]  px-2.5 py-1.5 text-xs gap-1.5",
            leadingIcon: "size-4",
            leadingAvatarSize: "3xs",
            trailingIcon: "size-4",
          },
          md: {
            base: "rounded-[10px]  px-2.5 py-1.5 text-sm gap-1.5",
            leadingIcon: "size-5",
            leadingAvatarSize: "2xs",
            trailingIcon: "size-5",
          },
          lg: {
            base: "rounded-[10px]  px-3 py-2 text-sm gap-2",
            leadingIcon: "size-5",
            leadingAvatarSize: "2xs",
            trailingIcon: "size-5",
          },
          xl: {
            base: "rounded-[10px]  px-3 py-2 text-base gap-2",
            leadingIcon: "size-6",
            leadingAvatarSize: "xs",
            trailingIcon: "size-6",
          },
          xxs: {
            base: "rounded-[10px]  px-4 py-3 text-xxs gap-2",
          },
          xxl: {
            base: "rounded-[10px] text-[length:17px] px-5 py-5 gap-2",
            leadingIcon: "size-6",
            leadingAvatarSize: "xs",
            trailingIcon: "size-6",
      
          },
        },
      },
      compoundVariants: [
        {
          color: "gradient",
          variant: "solid",
          class:
            "text-inverted bg-gradient-to-br  from-light-gray to-dark-gray aria-disabled:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        },
      ],
    },
  },
});
