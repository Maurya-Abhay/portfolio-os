import { prisma } from '@/lib/db/prisma';

const REGISTRATION_KEY = 'registrationEnabled';

export async function getRegistrationEnabled() {
  const setting = await prisma.appSetting.findUnique({
    where: { key: REGISTRATION_KEY },
  });

  return setting ? Boolean(setting.value) : true;
}

export async function setRegistrationEnabled(enabled: boolean) {
  return prisma.appSetting.upsert({
    where: { key: REGISTRATION_KEY },
    update: { value: enabled },
    create: { key: REGISTRATION_KEY, value: enabled },
  });
}
