declare const UIkit: any;

export const hideModalFromId = (id: string) => {
  const element = document.querySelector(`#${id}`);
  UIkit.modal(element).hide();
};

export default function showModalFromId(id: string) {
  const element = document.querySelector(`#${id}`);
  UIkit.modal(element).show();
}
export const confirmationDialog = () => {
  return UIkit.modal.confirm("Confirm Delete!");
};
